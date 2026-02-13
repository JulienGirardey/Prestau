import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../../prisma.service';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewService {
	constructor(private Prisma: PrismaService) { }

	async create(createReviewDto: CreateReviewDto): Promise<Review> {
		// review yourself
		if (
			createReviewDto.reviewerId === createReviewDto.revieweeId &&
			createReviewDto.reviewerType === createReviewDto.revieweeType
		) {
			throw new BadRequestException('Cannnot review yourself');
		}

		return this.Prisma.review.create({
			data: createReviewDto,
		});
	}

	async findAll(): Promise<Review[]> {
		return this.Prisma.review.findMany();
	}

	async findOne(id: number): Promise<Review> {
		const review = await this.Prisma.review.findUnique({
			where: { id },
		});

		if (!review) {
			throw new NotFoundException(`Review with ID ${id} not found`);
		}

		return review;
	}

	async remove(id: number): Promise<Review> {
		const review = await this.Prisma.review.findUnique({
			where: { id },
		});

		if (!review) {
			throw new NotFoundException(`Review with ID ${id} not found`);
		}
		return this.Prisma.review.delete({
			where: { id },
		});
	}
}
