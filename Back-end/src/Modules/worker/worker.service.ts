import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PrismaService } from '../../prisma.service';
import { Worker } from '@prisma/client';

@Injectable()
export class WorkerService {
	constructor(private prisma: PrismaService) { }

	// créer un worker lié à un utilisateur (userId)
	async create(createWorkerDto: CreateWorkerDto, userId: number): Promise<Worker> {
		return this.prisma.worker.create({
			data: {
				...createWorkerDto,
				userId, // association du worker avec l'utilisateur qui l'a créé (=même token)
			}
		});
	}

	// trouver un worker par son userId (pour que le worker puisse voir son profil)
	async findOneByUserId(userId: number) {
		const worker = await this.prisma.worker.findUnique({
			where: { userId }
		});
		// Vérifie si un worker avec ce userId existe dans la base de données pour le retourner
		if (!worker) {
			throw new NotFoundException(`Worker not found`);
		}
		return worker;
	}

	// trouver un worker par son id (pour que la company puisse voir le profil d'un worker)
	async findOne(id: number) {
		const worker = await this.prisma.worker.findUnique({
			where: { id }
		});
		// Vérifie si un worker avec cet id existe dans la base de données pour le retourner
		if (!worker) {
			throw new NotFoundException(`Worker not found`);
		}
		return worker;
	}

	// mettre à jour un worker par son userId (pour que le worker puisse mettre à jour son profil)
	async update(userId: number, updateWorkerDto: UpdateWorkerDto) {
		const updateworker = await this.prisma.worker.findUnique({
			where: { userId }
		});
		// Vérifie si un worker avec cet id existe dans la base de données pour le mettre à jour
		if (!updateworker) {
			throw new NotFoundException(`Worker not found`);
		}
		return this.prisma.worker.update({
			where: { userId },
			data: updateWorkerDto,
		});
	}

	// supprimer un worker par son userId (pour que le worker puisse supprimer son profil)
	async remove(userId: number) {
		const deleteworker = await this.prisma.worker.findUnique({
			where: { userId }
		});
		// Vérifie si un worker avec cet id existe dans la base de données pour le supprimer
		if (!deleteworker) {
			throw new NotFoundException(`Worker not found`);
		}
		return this.prisma.worker.delete({
			where: { userId }
		});
	}
}
