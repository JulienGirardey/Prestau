import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobofferDto } from './dto/create-joboffer.dto';
import { PrismaService } from '../../prisma.service';
import { JobOffer } from '@prisma/client';
import { worker } from 'node:cluster';

@Injectable()
export class JobofferService {
	constructor(private Prisma: PrismaService) { }

	async create(createJobofferDto: CreateJobofferDto, userId: number, jobId: number): Promise<JobOffer> {
		const existingJobOffer = await this.Prisma.jobOffer.findFirst({
			where: { workerId: userId },
		});

		if (existingJobOffer) {
			throw new NotFoundException('A job offer already exists for this worker.');
		}

		return this.Prisma.jobOffer.create({
			data: {
				...createJobofferDto,
				workerId: userId, // association de l'offre d'emploi avec l'utilisateur qui l'a créée (même token)
				jobId: jobId, // association de l'offre d'emploi avec le job auquel elle est liée
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
