import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth.dto.response';
import { CurrentUser } from './decorators/current-user-decorator';
import { JWTPayloadType } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async signup({
    username,
    email,
    password,
  }: RegisterDto): Promise<AuthResponseDto> {
    await this.userService.assertEmailIsAvailable(email);

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
    });

    const token = await this.userService.generateJwtToken(user);
    return { user, token };
  }

  public async signin({ email, password }: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findOneByEmail(email);
    await this.userService.checkPassword(user, password);
    const token = await this.userService.generateJwtToken(user);
    return { user, token };
  }

  public async currentUser(id: number): Promise<User> {
    const currentUser = await this.userService.findOneById(id);
    return currentUser;
  }
}
