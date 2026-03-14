import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../../prisma.service';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class JobService {
	constructor(private prisma: PrismaService) { }

	// Une entreprise peut créer une proposition d'emploi, qui est liée à son compte utilisateur via la table company (company.userId)
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

	// Une entreprise peut récupérer la liste de ses propositions d'emploi postées
  async findByUserId(userId: number) {
    const company = await this.prisma.company.findUnique({
      where: { userId } // Trouve la company associée à l'utilisateur
    });
    
    if (!company) {
      throw new NotFoundException('Company not found');
    }

		// Récupère tous les jobs liés à cette company, avec les offres d'emploi associées qui sont encore en statut PENDING
    return this.prisma.job.findMany({
      where: { companyId: company.id },
      include: { 
				company: true,
				jobOffers: { where: { status: 'PENDING' } }
			},
    });
  }

	// Un worker voit tous les jobs disponibles, avec une option de recherche par titre ou ville (insensible à la casse)
	async findAll(user: { id: number; role: Role }, search?: string) {
		const searchFilter = search?.trim()
			? {
				OR: [
					{ title: { contains: search.trim(), mode: 'insensitive' as const } },
					{ company: { city: { contains: search.trim(), mode: 'insensitive' as const } } },
				],
			}
			: {};

		// Si c'est une company, elle ne voit que ses propres jobs
		if (user.role === Role.COMPANY) {
			const company = await this.prisma.company.findUnique({
				where: { userId: user.id } // Trouve la company associée à l'utilisateur
			});

			if (!company) {
				throw new NotFoundException('Company not found');
			}
			// Récupère tous les jobs liés à cette companyy
			return this.prisma.job.findMany({
				where: { companyId: company.id, ...searchFilter },
				include: { company: true },
			});
		}
		// Si c'est un worker, il voit tous les jobs disponibles (filtrés par recherche si fournie)
		return this.prisma.job.findMany({ where: searchFilter, include: { company: true } })
	}

	async findOne(id: number, userId?: number) {
		const job = await this.prisma.job.findUnique({
			where: { id },
			include: { 
				company: true,
				jobOffers: {
					include: {
						worker: true }
				}
			},
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

		const job = await this.findOne(id);
		// Vérifie que la company est bien propriétaire du job pour pouvoir le supprimer
		if (job.companyId !== company.id) {
			throw new ForbiddenException('You are not authorized to delete this job');
		}

		// Vérifie si des workers ont déjà postulé
		const jobOffers = await this.prisma.jobOffer.findMany({
			where: { jobId: id }
		});

		if (jobOffers.length > 0) {
			throw new ForbiddenException('You cannot delete this job because workers have already applied');
		}

		return this.prisma.job.delete({
			where: { id },
		});
	}
}
