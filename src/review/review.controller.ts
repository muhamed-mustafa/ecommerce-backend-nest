import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CurrentUser } from '../auth/decorators/current-user-decorator';
import { JWTPayloadType } from 'src/utils/jwt.type';
import { CreateReviewDto } from './dto/create.review.dto';
import { AuthRoleGuard } from '../user/guards/auth.guard.roles';
import { UserType } from '../utils/enums';
import { Role } from '../user/decorators/user.role.decorator';
import { UpdateReviewDto } from './dto/update.review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':productId')
  @UseGuards(AuthRoleGuard)
  @Role(UserType.ADMIN, UserType.USER)
  async createReview(
    @Param('productId') productId: number,
    @CurrentUser() user: JWTPayloadType,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return await this.reviewService.createReview(
      user.id,
      productId,
      createReviewDto,
    );
  }
  @Get(':productId')
  async getAllReviewsByProductId(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.reviewService.getAllReviewsByProductId(
      productId,
      page,
      limit,
    );
  }

  @Patch(':reviewId')
  @UseGuards(AuthRoleGuard)
  @Role(UserType.ADMIN, UserType.USER)
  async updateReview(
    @Param('reviewId') reviewId: number,
    @CurrentUser() user: JWTPayloadType,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewService.updateReview(
      reviewId,
      user.id,
      updateReviewDto,
    );
  }

  @Delete(':reviewId')
  @UseGuards(AuthRoleGuard)
  @Role(UserType.ADMIN, UserType.USER)
  async deleteReview(
    @Param('reviewId') reviewId: number,
    @CurrentUser() user: JWTPayloadType,
  ) {
    return await this.reviewService.deleteReview(reviewId, user.id);
  }
}
