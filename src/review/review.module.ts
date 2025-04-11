import { Module } from '@nestjs/common';
import { Review } from './review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [],
    providers: [],
    imports: [TypeOrmModule.forFeature([Review])],
    exports: [],
})
export class ReviewModule {}
