import { BadRequestException, Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../../prisma.service';
import { Review } from '@prisma/client';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class ReviewService {
    constructor(private Prisma: PrismaService) { }

    async create(createReviewDto: CreateReviewDto, userId: number): Promise<Review> {
        // Vérifier que le reviewee existe
        await this.validateRevieweeExists(createReviewDto.revieweeId, createReviewDto.revieweeType);

        // Empêcher l'auto-évaluation
        if (userId === createReviewDto.revieweeId) {
            throw new BadRequestException('Vous ne pouvez pas vous évaluer vous-même.');
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
	// Supprimer une review (seul l'auteur peut supprimer son avis)
    async remove(id: number, userId: number): Promise<Review> {
        const review = await this.Prisma.review.findUnique({
            where: { id },
        });

        if (!review) {
            throw new NotFoundException(`Avis introuvable.`);
        }

        if (review.reviewerId !== userId) {
            throw new ForbiddenException('Vous ne pouvez supprimer que vos propres avis.');
        }

        return this.Prisma.review.delete({
            where: { id },
        });
    }
}
