import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobofferDto } from './dto/create-joboffer.dto';
import { PrismaService } from '../../prisma.service';
import { JobOffer, Prisma, Review } from '@prisma/client';

@Injectable()
export class JobofferService {
	constructor(private Prisma: PrismaService) { }

	async create(createJobofferDto: CreateJobofferDto): Promise<JobOffer> {
		return this.Prisma.jobOffer.create({
			data: createJobofferDto,
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
