import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UseGuards } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
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

  @Get(':id') // Récupérer une review par ID
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }
}
