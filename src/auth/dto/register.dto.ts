import { BaseAuthDto } from './base.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class RegisterDto extends BaseAuthDto {
  @IsOptional()
  @Length(2, 255)
  @IsString()
  username: string;
}
