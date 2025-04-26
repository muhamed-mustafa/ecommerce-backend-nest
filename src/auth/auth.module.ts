import { MailModule } from './../mail/mail.module';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerUserStorage } from '../utils/multer';
@Module({
  imports: [UserModule, MulterModule.register({ storage: multerUserStorage }), MailModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
