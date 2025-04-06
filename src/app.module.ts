import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ReviewModule } from './review/review.module';
import { ReviewController } from './review/review.controller';
import { ReviewService } from './review/review.service';
import { ProductModule } from './product/product.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [UserModule, AuthModule, ProductModule, ReviewModule],
  controllers: [AppController, UserController, AuthController, ProductController, ReviewController],
  providers: [AppService, UserService, AuthService, ProductService, ReviewService],
})
export class AppModule {}
