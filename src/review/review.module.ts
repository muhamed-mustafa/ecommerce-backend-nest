import { Module } from '@nestjs/common';
import { Review } from './review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';
import { ReviewController } from './review.controller';
import { UserModule } from '../user/user.module';
import { ReviewService } from './review.service';

@Module({
    controllers: [ReviewController],
    providers: [ReviewService],
    imports: [TypeOrmModule.forFeature([Review]), ProductModule, AuthModule, UserModule],
})
export class ReviewModule {}
