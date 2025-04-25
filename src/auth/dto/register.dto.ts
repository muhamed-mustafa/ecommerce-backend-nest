import { ApiProperty } from '@nestjs/swagger';
import { BaseAuthDto } from './base.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class RegisterDto extends BaseAuthDto {
  @IsOptional()
  @Length(2, 255)
  @IsString()
  @ApiProperty({ type: 'string', required: false, name: 'username' })
  username: string;
}
