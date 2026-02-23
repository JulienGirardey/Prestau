import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class MessageService {
	constructor(private prisma: PrismaService) { }

	async create(createMessageDto: CreateMessageDto, userId: number) {
		return await this.prisma.message.create({
			data: {
				content: createMessageDto.content,
				jobOfferId: createMessageDto.jobOfferId,
				senderId: createMessageDto.senderId,
				receiverId: createMessageDto.receiverId,
			},
			include: {
				jobOffer: true,
			}
		});
	}

	async findAll(userId: number) {
		return this.prisma.message.findMany({
			include: {
				jobOffer: true,
			}
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
			throw new NotFoundException(`Message with this ID ${id} not found`);
		}
		return message;
	}
	
}
