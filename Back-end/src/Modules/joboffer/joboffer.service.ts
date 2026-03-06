import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateJobofferDto } from './dto/create-joboffer.dto';
import { PrismaService } from '../../prisma.service';
import { JobOffer } from '@prisma/client';

@Injectable()
export class JobofferService {
	constructor(private Prisma: PrismaService) { }

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
			throw new NotFoundException('A job offer already exists for this worker.');
		}

		return this.Prisma.jobOffer.create({
			data: {
				...createJobofferDto,
				workerId: worker.id,
				jobId: jobId,
			},
		});
	}

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

	async findAll(): Promise<JobOffer[]> {
		return this.Prisma.jobOffer.findMany({
			include: {
				job: true,
				worker: true,
			},
		});
	}

	async findHistory(userId: number, role: string): Promise<JobOffer[]> {
		if (role === 'WORKER') {
			const worker = await this.Prisma.worker.findUnique({
				where: { userId },
			});

			if (!worker) {
				throw new NotFoundException('Worker not found');
			}

			return this.Prisma.jobOffer.findMany({
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
		}
		
		if (role === 'COMPANY') {
			const company = await this.Prisma.company.findUnique({
				where: { userId },
			});

			if (!company) {
				throw new NotFoundException('Company not found');
			}

			return this.Prisma.jobOffer.findMany({
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
		}

		return [];
	}

	async findOne(id: number): Promise<JobOffer> {
		const jobOffer = await this.Prisma.jobOffer.findUnique({
			where: { id },
			include: {
				job: true,
				worker: true,
			},
		});

		if (!jobOffer) {
			throw new NotFoundException(`JobOffer with ID ${id} not found`);
		}
		return jobOffer;
	}

	async remove(id: number): Promise<JobOffer> {
		const jobOffer = await this.Prisma.jobOffer.delete({
			where: { id },
		});

		if (!jobOffer) {
			throw new NotFoundException(`JobOffer with ID ${id} not found`);
		}
		return jobOffer;
	}
}
