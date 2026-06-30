import { Controller, Post, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { CurrentUserRequest } from '../auth/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('review')
@UseGuards(JwtAuthGuard) // Applique JWT puis Roles guard à tous les endpoints
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post() // Créer une review
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: CurrentUserRequest) {
    return this.reviewService.create(createReviewDto, req.user.id);
  }
}
