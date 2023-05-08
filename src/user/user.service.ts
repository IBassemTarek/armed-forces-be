import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { LoginResponse } from './dto/login-user.dto';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly usersRepository: UsersRepository,
  ) {}
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

  async login({
    password,
    email,
  }: {
    password: string;
    email: string;
  }): Promise<LoginResponse> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (compareSync(password, user?.password)) {
      const token = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRE_DURATION,
        },
      );
      return {
        accessToken: token,
      };
    }

    throw new UnauthorizedException();
  }
}
