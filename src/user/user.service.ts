import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(id: string): Promise<User> {
    return this.usersRepository.findOne({ id });
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async createUser({ email, name, password }: CreateUserDto): Promise<User> {
    return this.usersRepository.create({
      id: uuidv4(),
      email,
      name,
      password,
    });
  }

  async updateUser(id: string, userUpdates: UpdateUserDto): Promise<User> {
    return this.usersRepository.findOneAndUpdate({ id }, userUpdates);
  }
}
