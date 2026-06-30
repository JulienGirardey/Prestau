import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class JobSchedulerService {
    private readonly logger = new Logger(JobSchedulerService.name);

    constructor(private Prisma: PrismaService) {}

    /**
     * Toutes les minutes, vérifie les jobs OPEN qui ont une JobOffer ACCEPTED
     * et dont le start_time est passé → passe le job en IN_PROGRESS.
     *
     * Le worker ne peut plus annuler sa candidature à partir de ce moment.
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async handleJobStart() {
        const now = new Date();


      console.log("CRON END");
      console.log("NOW =", now);
        // Trouver tous les jobs OPEN avec une candidature ACCEPTED dont start_time est passé
        const jobsToStart = await this.Prisma.job.findMany({
            where: {
                status: 'OPEN',
                start_time: { lte: now },
                jobOffers: {
                    some: { status: 'ACCEPTED' },
                },
            },
        });

        if (jobsToStart.length === 0) return;

        this.logger.log(`[Cron] ${jobsToStart.length} mission(s) à passer en IN_PROGRESS`);

        await this.Prisma.job.updateMany({
            where: { id: { in: jobsToStart.map((j) => j.id) } },
            data: { status: 'IN_PROGRESS' },
        });
    }

    /**
     * Toutes les minutes, vérifie les jobs IN_PROGRESS dont end_time est passé
     * → passe le job en COMPLETED et la JobOffer ACCEPTED en COMPLETED.
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async handleJobEnd() {
        const now = new Date();

        // Trouver tous les jobs IN_PROGRESS dont end_time est passé
        const jobsToComplete = await this.Prisma.job.findMany({
            where: {
                status: 'IN_PROGRESS',
                end_time: { lte: now },
            },
            include: {
                jobOffers: {
                    where: { status: 'ACCEPTED' },
                },
            },
        });

        if (jobsToComplete.length === 0) return;

        this.logger.log(`[Cron] ${jobsToComplete.length} mission(s) à passer en COMPLETED`);

        for (const job of jobsToComplete) {
            await this.Prisma.$transaction([
                // Passer le job en COMPLETED
                this.Prisma.job.update({
                    where: { id: job.id },
                    data: { status: 'COMPLETED' },
                }),
                // Passer toutes les JobOffers ACCEPTED de ce job en COMPLETED
                this.Prisma.jobOffer.updateMany({
                    where: {
                        jobId: job.id,
                        status: 'ACCEPTED',
                    },
                    data: { status: 'COMPLETED' },
                }),
            ]);
        }
    }
}
