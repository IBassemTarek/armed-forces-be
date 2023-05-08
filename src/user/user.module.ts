import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UsersRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '/.env'),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '60s' },
      secretOrPrivateKey: process.env.JWT_ACCESS_TOKEN_SECRET,
      verifyOptions: {
        ignoreExpiration: false,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UsersRepository],
})
export class UserModule {}
