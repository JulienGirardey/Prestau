import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateJobofferDto } from './dto/create-joboffer.dto';
import { PrismaService } from '../../prisma.service';
import { JobOffer } from '@prisma/client';

@Injectable()
export class JobofferService {
    constructor(private Prisma: PrismaService) { }

    // Créer une nouvelle candidature pour un worker
    async create(createJobofferDto: CreateJobofferDto, userId: number, jobId: number): Promise<JobOffer> {
        const worker = await this.Prisma.worker.findUnique({
            where: { userId },
        });

        if (!worker) {
            throw new NotFoundException('Worker not found');
        }

        const existingJobOffer = await this.Prisma.jobOffer.findFirst({
            where: { workerId: worker.id, jobId: jobId },
        });

        if (existingJobOffer) {
            throw new ConflictException('A job offer already exists for this worker.');
        }

        return this.Prisma.jobOffer.create({
            data: {
                ...createJobofferDto,
                workerId: worker.id,
                jobId: jobId,
            },
        });
    }

    // Accepter une candidature par l'entreprise
    async accept(id: number, userId: number): Promise<JobOffer> {
        const jobOffer = await this.Prisma.jobOffer.findUnique({
            where: { id },
            include: { job: { include: { company: true } } },
        });

        if (!jobOffer) {
            throw new NotFoundException(`JobOffer with ID ${id} not found`);
        }

        if (jobOffer.job.company.userId !== userId) {
            throw new NotFoundException('You are not authorized to accept this offer');
        }

        const updatedOffer = await this.Prisma.jobOffer.update({
            where: { id },
            data: {
                status: 'ACCEPTED',
                selected_by_company: true,
                response_at: new Date(),
            },
        });

        await this.Prisma.job.update({
            where: { id: jobOffer.jobId },
            data: { status: 'IN_PROGRESS' },
        });

        await this.Prisma.jobOffer.updateMany({
            where: {
                jobId: jobOffer.jobId,
                id: { not: id },
            },
            data: {
                status: 'REJECTED',
                response_at: new Date(),
            },
        });

        return updatedOffer;
    }

    // Rejeter une candidature par l'entreprise
    async reject(id: number, userId: number): Promise<JobOffer> {
        const jobOffer = await this.Prisma.jobOffer.findUnique({
            where: { id },
            include: { job: { include: { company: true } } },
        });

        if (!jobOffer) {
            throw new NotFoundException(`JobOffer with ID ${id} not found`);
        }

        if (jobOffer.job.company.userId !== userId) {
            throw new NotFoundException('You are not authorized to reject this offer');
        }

        return this.Prisma.jobOffer.update({
            where: { id },
            data: {
                status: 'REJECTED',
                response_at: new Date(),
            },
        });
    }

    // Marquer une mission comme terminée
    async complete(id: number, userId: number): Promise<JobOffer> {
        const jobOffer = await this.Prisma.jobOffer.findUnique({
            where: { id },
            include: { job: { include: { company: true } } },
        });

        if (!jobOffer) {
            throw new NotFoundException(`JobOffer with ID ${id} not found`);
        }

        if (jobOffer.job.company.userId !== userId) {
            throw new NotFoundException('You are not authorized to complete this offer');
        }

        const updatedOffer = await this.Prisma.jobOffer.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });

        await this.Prisma.job.update({
            where: { id: jobOffer.jobId },
            data: { status: 'COMPLETED' },
        });

        return updatedOffer;
    }

    // Récupérer toutes les candidatures reçues par une entreprise
    async findByCompany(userId: number): Promise<JobOffer[]> {
        const company = await this.Prisma.company.findUnique({
            where: { userId },
        });

        if (!company) {
            throw new NotFoundException('Company not found');
        }

        return this.Prisma.jobOffer.findMany({
            where: {
                job: { companyId: company.id },
            },
            include: {
                job: true,
                worker: true,
            },
        });
    }

    // Récupérer toutes les candidatures d'un worker
    async findMyApplications(userId: number) {
        const worker = await this.Prisma.worker.findUnique({
            where: { userId },
        });

        if (!worker) {
            throw new NotFoundException('Worker not found');
        }

        return this.Prisma.jobOffer.findMany({
            where: { workerId: worker.id },
            include: {
                job: true,
            },
        });
    }

    // Récupérer toutes les candidatures (admin)
    async findAll(): Promise<JobOffer[]> {
        return this.Prisma.jobOffer.findMany({
            include: {
                job: true,
                worker: true,
            },
        });
    }

    // Récupérer l'historique des missions terminées
    async findHistory(userId: number, role: string) {
        let jobOffers: any[];

        if (role === 'WORKER') {
            const worker = await this.Prisma.worker.findUnique({
                where: { userId },
            });

            if (!worker) {
                throw new NotFoundException('Worker not found');
            }

            jobOffers = await this.Prisma.jobOffer.findMany({
                where: {
                    workerId: worker.id,
                    status: 'COMPLETED',
                },
                include: {
                    job: {
                        include: { company: true },
                    },
                },
                orderBy: { updatedAt: 'desc' },
            });
        } else if (role === 'COMPANY') {
            const company = await this.Prisma.company.findUnique({
                where: { userId },
            });

            if (!company) {
                throw new NotFoundException('Company not found');
            }

            jobOffers = await this.Prisma.jobOffer.findMany({
                where: {
                    job: { companyId: company.id },
                    status: 'COMPLETED',
                },
                include: {
                    job: true,
                    worker: true,
                },
                orderBy: { updatedAt: 'desc' },
            });
        } else {
            return [];
        }

        // Pour chaque mission, ajouter hasReviewed et receivedRating
        return Promise.all(
            jobOffers.map(async (offer) => {
                const existingReview = await this.Prisma.review.findFirst({
                    where: { jobId: offer.jobId, reviewerId: userId },
                });

                const receivedReview = await this.Prisma.review.findFirst({
                    where: { jobId: offer.jobId, revieweeId: userId },
                });

                return {
                    ...offer,
                    hasReviewed: !!existingReview,
                    myRating: existingReview?.rating ?? null,
                    myComment: existingReview?.comment ?? null,
                    receivedRating: existingReview && receivedReview ? receivedReview.rating : null,
                    receivedComment: existingReview && receivedReview ? receivedReview.comment : null,
                };
            }),
        );
    }

    // Récupérer une candidature spécifique par ID
    async findOne(id: number, userId: number, role: string) {
        const jobOffer = await this.Prisma.jobOffer.findUnique({
            where: { id },
            include: {
                job: { include: { company: true } },
                worker: true,
            },
        });

        if (!jobOffer) {
            throw new NotFoundException(`JobOffer with ID ${id} not found`);
        }

        // Vérifier si l'user connecté a déjà laissé un avis pour ce job
        const existingReview = await this.Prisma.review.findFirst({
            where: { jobId: jobOffer.jobId, reviewerId: userId },
        });

        // Récupérer la note reçue de l'autre partie
        const revieweeId = role === 'WORKER' ? jobOffer.worker?.id : jobOffer.job.company?.id;
        const receivedReview = revieweeId
            ? await this.Prisma.review.findFirst({
                  where: { jobId: jobOffer.jobId, revieweeId: userId },
              })
            : null;

        return {
            ...jobOffer,
            hasReviewed: !!existingReview,
            receivedRating: existingReview && receivedReview ? receivedReview.rating : null,
            receivedComment: existingReview && receivedReview ? receivedReview.comment : null,
        };
    }

	// Annuler une candidature par le worker
	async removeByJobAndWorker(jobId: number, userId: number) {
		const worker = await this.Prisma.worker.findUnique({
			where: { userId }
		});

		if (!worker) throw new NotFoundException('Worker not found');

		const offer = await this.Prisma.jobOffer.findFirst({
			where: {
				jobId: jobId,
				workerId: worker.id
			}
		});

		if (!offer) throw new NotFoundException('Candidature non trouvée');

		return this.Prisma.$transaction([

			this.Prisma.jobOffer.delete({
				where: { id: offer.id }
			}),

			this.Prisma.job.update({
				where: { id: jobId },
				data: { status: 'OPEN' }
			})
		]);
	}
}