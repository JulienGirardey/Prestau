import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../../prisma.service';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class JobService {
	constructor(private prisma: PrismaService) { }

	async create(createJobDto: CreateJobDto, userId: number) {
		const company = await this.prisma.company.findUnique({
			where: { userId }
		});

		if (!company) {
			throw new NotFoundException('Company not found');
		}
		return this.prisma.job.create({
			data: {
				...createJobDto,
				companyId: company.id,
			}
		});
	}

  async findByUserId(userId: number) {
    const company = await this.prisma.company.findUnique({
      where: { userId }
    });
    
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.prisma.job.findMany({
      where: { companyId: company.id },
      include: { company: true },
    });
  }

	async findAll(user: { id: number; role: Role }) {
		if (user.role === Role.COMPANY) {
			const company = await this.prisma.company.findUnique({
				where: { userId: user.id } // Trouve la company associée à l'utilisateur
			});

			if (!company) {
				throw new NotFoundException('Company not found');
			}

			return this.prisma.job.findMany({
				where: { companyId: company.id },
				include: { company: true },
			});
		}
		// Le worker voit tous les jobs
		return this.prisma.job.findMany({ include: { company: true } })
	}

	async findOne(id: number, userId?: number) {
		const job = await this.prisma.job.findUnique({
			where: { id },
			include: { company: true }
		});

		if (!job) {
			throw new NotFoundException('Job not found');
		}

		let alreadyApplied = false;
		let isWorker = false;

		if (userId) {
			const worker = await this.prisma.worker.findUnique({
				where: { userId }
			});

			if (worker) {
				isWorker = true;
				// Vérifier si une candidature existe déjà
				const existingOffer = await this.prisma.jobOffer.findFirst({
					where: {
						jobId: id,
						workerId: worker.id
					}
				});
				alreadyApplied = !!existingOffer;
			}
		}

		return {
			...job,
			isWorker,
			alreadyApplied,
			canApply: isWorker && !alreadyApplied
		};
	}

	async update(id: number, updateJobDto: UpdateJobDto, userId: number) {
		const company = await this.prisma.company.findUnique({
			where: { userId }
		});

		if (!company) {
			throw new NotFoundException('Company not found');
		}

		const job = await this.findOne(id);
		// Vérifie que la company est bien propriétaire du job pour pouvoir le mettre à jour
		if (job.companyId !== company.id) {
			throw new ForbiddenException('You are not authorized to update this job');
		}

		return this.prisma.job.update({
			where: { id },
			data: updateJobDto,
		});
	}

	async remove(id: number, userId: number) {
		const company = await this.prisma.company.findUnique({
			where: { userId }
		});

		if (!company) {
			throw new NotFoundException('Company not found');
		}

		const job = await this.findOne(id)

		// Vérifie que la company est bien propriétaire du job pour pouvoir le supprimer
		if (job.companyId !== company.id) {
			throw new ForbiddenException(`You are not authorized to delete this job`)
		}
		return this.prisma.job.delete({
			where: { id },
		});
	}
}
