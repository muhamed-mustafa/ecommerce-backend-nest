import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth.dto.response';
import { JWTPayloadType } from 'src/utils/jwt.type';
import { CurrentUser } from './decorators/current-user-decorator';
import { AuthGuard } from './guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
    @ApiBody({ type: RegisterDto, required: true, description: 'Profile image' })
  async signup(
    @Body() registerDto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const hostUrl = `${req.protocol}://${req.get('host')}`;
    const profileImage = file
      ? `${hostUrl}/uploads/users/${file.filename}`
      : null;

    return this.authService.signup({
      ...registerDto,
      profileImage,
    });
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.signin(loginDto);
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  async currentUser(@CurrentUser() user: JWTPayloadType): Promise<User> {
    return this.authService.currentUser(user.id);
  }

  @Get('verify/:id/:verificationToken')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Param('id', ParseIntPipe) id: number,
    @Param('verificationToken') verificationToken: string,
  ): Promise<User> {
    return this.authService.verifyUser(id, verificationToken);
  }
}
