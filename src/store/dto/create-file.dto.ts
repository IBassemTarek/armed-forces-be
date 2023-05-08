import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ type: 'file', format: 'binary', required: true })
  file: any;

  @ApiProperty({ required: false })
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  branch: string;
}
