import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth.dto.response';
import { MailService } from 'src/mail/mail.service';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  public async signup({
    username,
    email,
    password,
    profileImage,
  }: RegisterDto): Promise<AuthResponseDto> {
    await this.userService.assertEmailIsAvailable(email);

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
      profileImage,
      verificationToken: randomUUID().toString(),
    });

    const token = await this.userService.generateJwtToken(user);

    // verify/:id/:token

    await this.mailService.sendMail(
      email,
      `${this.configService.get<string>('DOMAIN')}/api/auth/verify/${user.id}/${user.verificationToken}`,
    );

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

  public async verifyUser(id: number, verificationToken: string): Promise<User> {
    const user = await this.currentUser(id);

    if (!user.verificationToken)
      throw new BadRequestException('there is no token to verify this user');

    console.log("user",user, verificationToken)
    if (user.verificationToken !== verificationToken) {
      throw new BadRequestException('token is not valid');
    }


    await this.userService.setIsVerified(user.id);
    return user;
  }
}
