import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class MessageService {
	constructor(private prisma: PrismaService) { }

	async create(createMessageDto: CreateMessageDto, userId: number) {
		// Vérifier que le jobOffer existe et récupérer les participants
		const jobOffer = await this.prisma.jobOffer.findUnique({
			where: { id: createMessageDto.jobOfferId },
			include: {
				job: { include: { company: true } },
				worker: true,
			}
		});

		if (!jobOffer) {
			throw new NotFoundException(`L'offre d'emploi avec l'ID ${createMessageDto.jobOfferId} n'existe pas`);
		}

		// Vérifier que l'utilisateur est impliqué dans ce jobOffer
		const isCompany = jobOffer.job.company.userId === userId;
		const isWorker = jobOffer.worker.userId === userId;

		if (!isCompany && !isWorker) {
			throw new ForbiddenException("Vous n'êtes pas autorisé à envoyer un message pour cette offre");
		}

		// Déterminer automatiquement le receiverId
		const receiverId = isCompany ? jobOffer.worker.userId : jobOffer.job.company.userId;

		// Créer le message avec les IDs sécurisés
		return await this.prisma.message.create({
			data: {
				content: createMessageDto.content,
				jobOfferId: createMessageDto.jobOfferId,
				senderId: userId,
				receiverId,
			},
			include: {
				jobOffer: true,
			}
		});
	}

	async findAll(userId: number) {
		// Ne retourne QUE les messages où l'utilisateur est sender OU receiver
		return this.prisma.message.findMany({
			where: {
				OR: [
					{ senderId: userId },
					{ receiverId: userId }
				]
			},
			include: {
				jobOffer: true,
			},
			orderBy: { sentAt: 'desc' }
		});
	}

	async findOne(id: number, userId: number) {
		const message = await this.prisma.message.findUnique({
			where: { id },
			include: {
				jobOffer: true,
			},
		});

		if (!message) {
			throw new NotFoundException(`Le message avec l'ID ${id} n'existe pas`);
		}

		// Vérifier que l'utilisateur est sender OU receiver
		if (message.senderId !== userId && message.receiverId !== userId) {
			throw new ForbiddenException("Vous n'avez pas accès à ce message");
		}

		return message;
	}
}
