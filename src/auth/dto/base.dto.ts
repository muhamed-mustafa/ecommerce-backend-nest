import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BaseAuthDto {
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, name: 'email' })
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, name: 'password' })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    name: 'profileImage',
  })
  profileImage?: string;
}
