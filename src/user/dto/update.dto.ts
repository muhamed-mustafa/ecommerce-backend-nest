import {
  IsString,
  MinLength,
  IsOptional,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 255)
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password: string;
}
