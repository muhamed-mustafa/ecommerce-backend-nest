import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-dto-response';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.signup(registerDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.signin(loginDto);
  }
}
