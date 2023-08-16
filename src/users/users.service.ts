/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ImageHandler } from 'src/utils/imageHandle';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user: User = await this.findOneByEmail(createUserDto.email);
    if (user !== null) {
      throw new BadRequestException('Email already in use');
    }
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);

    const newUser: User = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);

    const { password, ...otherData } = newUser;

    return otherData;
  }

  findAll(name?: string): Promise<User[]> {
    return this.userRepository.find({
      where: {
        name: name,
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    const { password, ...otherData } = user;

    return otherData;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    file: any,
    req: any,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (file && user.photo) {
      new ImageHandler().deleteImage(user.photo);
      updateUserDto.photo = null;
    }

    if (file) {
      const address = new ImageHandler().uploadImage(req, file);
      updateUserDto.photo = address;
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    const { password, ...otherData } = updatedUser;
    return otherData;
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (user.photo) {
      new ImageHandler().deleteImage(user.photo);
    }
    return this.userRepository.remove(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async createUserByOauth(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user;
  }
}
