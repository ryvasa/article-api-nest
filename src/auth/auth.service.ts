/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { responseFormat } from 'src/utils/responseFormat';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    if (!user.password) {
      throw new BadRequestException('Wrong password');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async logout(req) {
    req.session.destroy();
    const result = new responseFormat(true, null, 'User has been logout');
    return result;
  }

  async validateGoogle(googleId: string) {
    const auth = await this.authRepository
      .createQueryBuilder('auth')
      .leftJoinAndSelect('auth.user', 'user')
      .where('auth.googleId = :googleId', { googleId })
      .getOne();

    if (!auth) {
      return null;
    }
    const { password, ...data } = auth.user;

    return data;
  }

  async createAuthGoogle(data) {
    const createAuthDto: CreateAuthDto = {
      googleId: data.id,
    };

    const newAuth = this.authRepository.create(createAuthDto);
    await this.authRepository.save(newAuth);

    const createUserDto: CreateUserDto = {
      name: data.displayName,
      email: data.emails[0].value,
      auth: newAuth,
    };
    const user = await this.usersService.createUserByOauth(createUserDto);
    const { password, auth, ...others } = user;
    return others;
  }
}
