import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { GetUser } from '../decorators/user.decorator';
import { JwtUser } from '../guards/jwt.strategy';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/login')
  async login(@Body() loginDto: LoginUserDto) {
    return await this.userService.login({
      password: loginDto.password,
      email: loginDto.email,
    });
  }

  @ApiBearerAuth()
  @Get('me')
  async getUser(@GetUser() user: JwtUser): Promise<User> {
    return this.userService.getUserById(user.userId);
  }

  @ApiBearerAuth()
  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @ApiBearerAuth()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @ApiBearerAuth()
  @Patch()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: JwtUser,
  ): Promise<User> {
    return this.userService.updateUser(user.userId, updateUserDto);
  }
}
