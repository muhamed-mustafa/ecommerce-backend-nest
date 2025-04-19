import { Module } from '@nestjs/common';
import { Review } from './review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';
import { ReviewController } from './review.controller';
import { UserModule } from 'src/user/user.module';
import { ReviewService } from './review.service';

@Module({
    controllers: [ReviewController],
    providers: [ReviewService],
    imports: [TypeOrmModule.forFeature([Review]), ProductModule, AuthModule, UserModule],
})
export class ReviewModule {}
