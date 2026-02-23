import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../../prisma.service';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class JobService {
	constructor(private prisma: PrismaService) { }

	async create(createJobDto: CreateJobDto, companyId: number) {
		return this.prisma.job.create({
			data: {
				...createJobDto,
				companyId,
			}
		});
	}

	findAll(user: { id: number; role: Role }) {
		if (user.role === Role.COMPANY) {
			// La company voit uniquement ses propres jobs
			return this.prisma.job.findMany({
				where: {
					companyId: user.id,
				}
			});
		}
		// Le worker voit tous les jobs
		return this.prisma.job.findMany()
	}

	async findOne(id: number) {
		const job = await this.prisma.job.findUnique({
			where: { id },
		});
		if (!job) {
			throw new NotFoundException(`Job not found`);
		}
		return job;
	}

	async update(id: number, updateJobDto: UpdateJobDto, companyId: number) {
		const job = await this.findOne(id);

		//vérifie que la company est bien propriétaire du job pour pouvoir le mettre à jour
		if (job.companyId !== companyId) {
			throw new ForbiddenException(`You are not autorized to update this job`);
		}

		return this.prisma.job.update({
			where: { id },
			data: updateJobDto,
		});
	}

	async remove(id: number, companyId: number) {
		const job = await this.findOne(id)

		// Vérifie que la company est bien propriétaire du job pour pouvoir le supprimer
		if (job.companyId !== companyId) {
			throw new ForbiddenException(`You are not autorized to delete this job`)
		}
		return this.prisma.job.delete({
			where: { id },
		});
	}
}
