import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { CreateReviewDto } from './dto/create.review.dto';
import { AuthService } from '../auth/auth.service';
import { UpdateReviewDto } from './dto/update.review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly authService: AuthService,
    private readonly productService: ProductService,
  ) {}

  async createReview(
    userId: number,
    productId: number,
    reviewDto: CreateReviewDto,
  ) {
    const user = await this.authService.currentUser(userId);
    const product = await this.productService.findOne(productId);
    const review = this.reviewsRepository.create({
      ...reviewDto,
      user,
      product,
    });

    return await this.reviewsRepository.save(review);
  }

  async getAllReviewsByProductId(
    productId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    return await this.reviewsRepository.find({
      where: { product: { id: productId } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getReviewById(reviewId: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException('Review not found!');

    return review;
  }

  async updateReview(
    reviewId: number,
    userId: number,
    updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.getReviewById(reviewId);
    const user = await this.authService.currentUser(userId);

    if (review.user?.id !== user.id) {
      throw new NotFoundException('You are not allowed to update this review!');
    }

    const updatedReview = await this.reviewsRepository.save({
      ...review,
      ...updateReviewDto,
    });

    return updatedReview;
  }

  async deleteReview(reviewId: number, userId: number) {
    const review = await this.getReviewById(reviewId);
    const user = await this.authService.currentUser(userId);

    if (review.user.id !== user.id) {
      throw new NotFoundException('You are not allowed to delete this review!');
    }

    return await this.reviewsRepository.delete(review);
  }
}
