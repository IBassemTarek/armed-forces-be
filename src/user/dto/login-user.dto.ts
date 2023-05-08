import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    default: 'ibassemtarek@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'qwerty123',
  })
  @IsNotEmpty()
  password: string;
}

export class LoginResponse {
  @ApiProperty()
  accessToken: string;
}
