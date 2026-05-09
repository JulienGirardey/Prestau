import { Injectable, NotFoundException, ConflictException, ForbiddenException, } from '@nestjs/common';
import { CreateJobofferDto } from './dto/create-joboffer.dto';
import { PrismaService } from '../../prisma.service';
import { JobOffer } from '@prisma/client';

@Injectable()
export class JobofferService {
    constructor(private Prisma: PrismaService) { }

// ─────────────────────────────────────────────────────────────
// CHECK CANDIDATURES STATUS
// ─────────────────────────────────────────────────────────────
    // Vérifie s'il reste des offres actives (PENDING ou ACCEPTED) pour un job.
    // Si non, remet le job en OPEN.
    private async checkAndResetJobStatus(jobId: number): Promise<void> {
        const activeOffersCount = await this.Prisma.jobOffer.count({
            where: {
                jobId,
                status: { in: ['PENDING', 'ACCEPTED'] },
            },
        });

        if (activeOffersCount === 0) {
            await this.Prisma.job.update({
                where: { id: jobId },
                data: { status: 'OPEN' },
            });
        }
    }

    // Créer une nouvelle candidature pour un worker
    async create(createJobofferDto: CreateJobofferDto, userId: number, jobId: number): Promise<JobOffer> {
        const worker = await this.Prisma.worker.findUnique({
            where: { userId },
        });

        if (!worker) {
            throw new NotFoundException('Worker not found');
        }

        // Vérifier si une candidature existe déjà (peu importe le statut)
        const existingJobOffer = await this.Prisma.jobOffer.findFirst({
            where: { workerId: worker.id, jobId },
        });

        if (existingJobOffer) {
            // Si elle était CANCELLED, on permet de re-postuler en la remettant en PENDING
            if (existingJobOffer.status === 'CANCELLED') {
                return this.Prisma.jobOffer.update({
                    where: { id: existingJobOffer.id },
                    data: {
                        ...createJobofferDto,
                        status: 'PENDING',
                        response_at: null,
                    },
                });
            }
            throw new ConflictException('A job offer already exists for this worker.');
        }

        return this.Prisma.jobOffer.create({
            data: {
                ...createJobofferDto,
                workerId: worker.id,
                jobId,
            },
        });
    }

    // ─────────────────────────────────────────────────────────────
    // WORKER — Annuler sa candidature
    // ─────────────────────────────────────────────────────────────

    async removeByJobAndWorker(jobId: number, userId: number): Promise<JobOffer> {
        const worker = await this.Prisma.worker.findUnique({ where: { userId } });

        if (!worker) throw new NotFoundException('Worker not found');

        const offer = await this.Prisma.jobOffer.findFirst({
            where: { jobId, workerId: worker.id },
        });

        if (!offer) throw new NotFoundException('Candidature non trouvée');

        // On ne peut annuler que si la candidature est encore active
        if (!['PENDING', 'ACCEPTED'].includes(offer.status)) {
            throw new ForbiddenException(
                'Cette candidature ne peut plus être annulée (déjà terminée, rejetée ou annulée)',
            );
        }

        // On passe la candidature en CANCELLED (on ne supprime pas pour garder l'historique)
        const updatedOffer = await this.Prisma.jobOffer.update({
            where: { id: offer.id },
            data: { status: 'CANCELLED', response_at: new Date() },
        });

        // On remet le job en OPEN s'il n'y a plus de candidatures actives
        await this.checkAndResetJobStatus(jobId);

        return updatedOffer;
    }

    // ─────────────────────────────────────────────────────────────
    // COMPANY — Accepter une candidature
    // ─────────────────────────────────────────────────────────────

    async accept(id: number, userId: number): Promise<JobOffer> {
        const jobOffer = await this.Prisma.jobOffer.findUnique({
            where: { id },
            include: { job: { include: { company: true } } },
        });

        if (!jobOffer) {
            throw new NotFoundException(`JobOffer with ID ${id} not found`);
        }

        if (jobOffer.job.company.userId !== userId) {
            throw new ForbiddenException('You are not authorized to accept this offer');
        }

        // On ne peut accepter que si la candidature est en PENDING
        if (jobOffer.status !== 'PENDING') {
            throw new ForbiddenException(
                `Cannot accept a job offer with status "${jobOffer.status}"`,
            );
        }

        // Accepter la candidature sélectionnée + passer le job en IN_PROGRESS
        const updatedOffer = await this.Prisma.jobOffer.update({
            where: { id },
            data: {
                status: 'ACCEPTED',
                selected_by_company: true,
                response_at: new Date(),
            },
        });

        // Rejeter automatiquement toutes les autres candidatures PENDING sur ce job
        await this.Prisma.jobOffer.updateMany({
            where: {
                jobId: jobOffer.jobId,
                id: { not: id },
                status: 'PENDING',
            },
            data: { status: 'REJECTED', response_at: new Date() },
        });

        return updatedOffer;
    }

    // ─────────────────────────────────────────────────────────────
    // COMPANY — Rejeter une candidature
    // ─────────────────────────────────────────────────────────────

    async reject(id: number, userId: number): Promise<JobOffer> {
        const jobOffer = await this.Prisma.jobOffer.findUnique({
            where: { id },
            include: { job: { include: { company: true } } },
        });

        if (!jobOffer) {
            throw new NotFoundException(`JobOffer with ID ${id} not found`);
        }

        if (jobOffer.job.company.userId !== userId) {
            throw new ForbiddenException('You are not authorized to reject this offer');
        }
        // On ne peut rejeter que si la candidature est en PENDING ou ACCEPTED
        if (!['PENDING', 'ACCEPTED'].includes(jobOffer.status)) {
            throw new ForbiddenException(
                `Cannot reject a job offer with status "${jobOffer.status}"`,
            );
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
            throw new ForbiddenException('You are not authorized to cancel this offer');
        }

        // On ne peut annuler que si la candidature est PENDING ou ACCEPTED
        if (!['PENDING', 'ACCEPTED'].includes(jobOffer.status)) {
            throw new ForbiddenException(
                `Cannot cancel a job offer with status "${jobOffer.status}"`,
            );
        }

				const updatedOffer = await this.Prisma.jobOffer.update({
						where: { id },
						data: {
								status: 'REJECTED',
								selected_by_company: false,
								response_at: new Date(),
						},
				});

				await this.checkAndResetJobStatus(jobOffer.jobId);
				return updatedOffer;
		}

    // ─────────────────────────────────────────────────────────────
    // COMPANY — Marquer une mission comme terminée
    // ─────────────────────────────────────────────────────────────

    async complete(id: number, userId: number): Promise<JobOffer> {
        const jobOffer = await this.Prisma.jobOffer.findUnique({
            where: { id },
            include: { job: { include: { company: true } } },
        });

        if (!jobOffer) {
            throw new NotFoundException(`JobOffer with ID ${id} not found`);
        }

        if (jobOffer.job.company.userId !== userId) {
            throw new ForbiddenException('You are not authorized to complete this offer');
        }

        // On ne peut compléter que si la candidature est ACCEPTED
        if (jobOffer.status !== 'ACCEPTED') {
            throw new ForbiddenException(
                `Cannot complete a job offer with status "${jobOffer.status}"`,
            );
        }

        const [updatedOffer] = await this.Prisma.$transaction([
            this.Prisma.jobOffer.update({
                where: { id },
                data: { status: 'COMPLETED' },
            }),
            this.Prisma.job.update({
                where: { id: jobOffer.jobId },
                data: { status: 'COMPLETED' },
            }),
        ]);

        return updatedOffer;
    }

    // ─────────────────────────────────────────────────────────────
    // COMPANY — Toutes les candidatures reçues (actives uniquement)
    // ─────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────
    // WORKER — Toutes ses candidatures (actives uniquement)
    // ─────────────────────────────────────────────────────────────

    async findMyApplications(userId: number) {
        const worker = await this.Prisma.worker.findUnique({
            where: { userId },
        });

        if (!worker) {
            throw new NotFoundException('Worker not found');
        }

        return this.Prisma.jobOffer.findMany({
            where: {
                workerId: worker.id,
                // On exclut les candidatures annulées et rejetées de la vue principale
                status: { not: 'CANCELLED' },
            },
            include: {
                job: {
                    include: { company: true },
                },
            },
        });
    }

    // ─────────────────────────────────────────────────────────────
    // HISTORIQUE — Missions terminées (worker ou company)
    // ─────────────────────────────────────────────────────────────

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
                    job: { include: { company: true } },
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
                    hasBeenReviewedByOtherParty: !!receivedReview, // Indique si l'autre partie a laissé un avis
                    myRating: existingReview?.rating ?? null, // Indique la note que l'utilisateur a laissée, ou null s'il n'a pas encore laissé d'avis
                    myComment: existingReview?.comment ?? null, // Indique le commentaire que l'utilisateur a laissé, ou null s'il n'a pas encore laissé d'avis
                                        // La note reçue n'est visible que si les deux parties ont reviewé
                    receivedRating: existingReview && receivedReview ? receivedReview.rating : null, // Indique la note que l'utilisateur a reçue de l'autre partie, ou null s'il n'a pas encore reçu d'avis
                    receivedComment: existingReview && receivedReview ? receivedReview.comment : null, // Indique le commentaire que l'utilisateur a reçue de l'autre partie, ou null s'il n'a pas encore reçu d'avis
                };
            }),
        );
    }

    // ─────────────────────────────────────────────────────────────
    // Récupérer une jobOffer spécifique par ID
    // ─────────────────────────────────────────────────────────────

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

        const receivedReview = await this.Prisma.review.findFirst({
            where: { jobId: jobOffer.jobId, revieweeId: userId },
        });

        return {
            ...jobOffer,
            hasReviewed: !!existingReview,
            hasBeenReviewedByOtherParty: !!receivedReview,
            receivedRating: existingReview && receivedReview ? receivedReview.rating : null,
            receivedComment: existingReview && receivedReview ? receivedReview.comment : null,
        };
    }
}

