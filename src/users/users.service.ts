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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user: User = await this.findOneByEmail(createUserDto.email);
    if (user !== null) {
      throw new BadRequestException();
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
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);

    return this.userRepository.remove(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
