import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    try {
      const password = await bcrypt.hash(user.password, 10);
      await this.userRepository.save({ ...user, password });
      return user;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('This user does not exist');
    }
    return user;
  }

  async findOneUserWithFiles(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['files'],
    });
    if (!user) {
      throw new NotFoundException('This user does not exist');
    }
    return user;
  }

  async update(id: string, user: UpdateUserDto) {
    try {
      return await this.userRepository.update({ id }, { ...user });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      return await this.userRepository.delete(id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
