import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../../prisma.service';
import { Review } from '@prisma/client';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class ReviewService {
    constructor(private Prisma: PrismaService) { }

    async create(createReviewDto: CreateReviewDto, userId: number): Promise<Review> {
        // Empêcher l'auto-évaluation
        if (userId === createReviewDto.revieweeId) {
            throw new BadRequestException('Vous ne pouvez pas vous évaluer vous-même.');
        }

				// Vérifier si l'utilisateur a déjà posté un avis pour ce job
    const existingReview = await this.Prisma.review.findFirst({
        where: {
            jobId: createReviewDto.jobId,
            reviewerId: userId,
        },
    });

    if (existingReview) {
        throw new BadRequestException('Vous avez déjà posté un avis pour cette mission.');
    }

        return this.Prisma.review.create({
            data: {
                ...createReviewDto,
                reviewerId: userId,
            },
        });
    }

	// Récupérer une review par ID 
    async findOne(id: number): Promise<Review> {
        const review = await this.Prisma.review.findUnique({
            where: { id },
        });

        if (!review) {
            throw new NotFoundException(`Avis introuvable.`);
        }

        return review;
    }
}
