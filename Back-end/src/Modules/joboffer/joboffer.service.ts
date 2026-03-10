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
                response_at: new Date(),
            },
        });

        await this.Prisma.job.update({
            where: { id: jobOffer.jobId },
            data: { status: 'IN_PROGRESS' },
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

        const updatedOffer = await this.Prisma.jobOffer.update({
            where: { id },
            data: {
                status: 'REJECTED',
                response_at: new Date(),
            },
        });

				await this.checkAndResetJobStatus(jobOffer.jobId);
				return updatedOffer;
    }

		// Annuler une candidature par company 
		async cancel(id: number, userId: number): Promise<JobOffer> {
				const jobOffer = await this.Prisma.jobOffer.findUnique({
						where: { id },
						include: { job: { include: { company: true } } },
				});

				if (!jobOffer) {
						throw new NotFoundException(`JobOffer with ID ${id} not found`);
				}

				if (jobOffer.job.company.userId !== userId) {
						throw new NotFoundException('You are not authorized to cancel this offer');
				}

				const updatedOffer = await this.Prisma.jobOffer.update({
						where: { id },
						data: {
								status: 'CANCELLED',
								selected_by_company: false,
								response_at: new Date(),
						},
				});

				await this.checkAndResetJobStatus(jobOffer.jobId);
				return updatedOffer;
		}

		// Fonction pour vérifier s'il reste des offres d'emploi actives (PENDING ou ACCEPTED) pour une mission donnée, et si non, remettre la mission en OPEN
		private async checkAndResetJobStatus(jobId: number) {
        const activeOffersCount = await this.Prisma.jobOffer.count({
            where: {
                jobId: jobId,
                status: {
                    in: ['PENDING', 'ACCEPTED']
                }
            }
        });

        if (activeOffersCount === 0) {
            await this.Prisma.job.update({
                where: { id: jobId },
                data: { status: 'OPEN' }
            });
        }
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
                job: {
                    include: { company: true },
                },
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

        // Pour chaque jobOffer, ajouter hasReviewed et receivedRating
        return Promise.all(
            jobOffers.map(async (offer) => {
							// Récupérer l'avis que l'utilisateur a laissé pour cette mission, s'il existe
                const existingReview = await this.Prisma.review.findFirst({
                    where: { jobId: offer.jobId, reviewerId: userId },
                });
							// Récupérer la note reçue de l'autre partie
                const receivedReview = await this.Prisma.review.findFirst({
                    where: { jobId: offer.jobId, revieweeId: userId },
                });

                return {
                    ...offer, // Inclure les données de base de l'offre
                    hasReviewed: !!existingReview, // Indique si l'utilisateur a déjà laissé un avis pour cette mission
                    myRating: existingReview?.rating ?? null, // Indique la note que l'utilisateur a laissée, ou null s'il n'a pas encore laissé d'avis
                    myComment: existingReview?.comment ?? null, // Indique le commentaire que l'utilisateur a laissé, ou null s'il n'a pas encore laissé d'avis
                    receivedRating: existingReview && receivedReview ? receivedReview.rating : null, // Indique la note que l'utilisateur a reçue de l'autre partie, ou null s'il n'a pas encore reçu d'avis
                    receivedComment: existingReview && receivedReview ? receivedReview.comment : null, // Indique le commentaire que l'utilisateur a reçue de l'autre partie, ou null s'il n'a pas encore reçu d'avis
                };
            }),
        );
    }

    // Récupérer une jobOffer spécifique par ID
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

        // Récupérer l'avis que l'utilisateur a laissé pour cette mission, s'il existe
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

	// Annuler une jobOffer par le worker
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
