import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PrismaService } from '../../prisma.service';
import { Worker } from '@prisma/client';

@Injectable()
export class WorkerService {
	constructor(private Prisma: PrismaService) { }

	async create(createWorkerDto: CreateWorkerDto): Promise<Worker> {
		const existingWorkerUserId = await this.Prisma.worker.findUnique({
			where: { userId: createWorkerDto.userId }
		});
		if (existingWorkerUserId) {
			throw new Error('Worker with this userId already exists');
		}

		return this.Prisma.worker.create({ data: createWorkerDto });
	}

	findAll() {
		return this.Prisma.worker.findMany();
	}

	async findOne(id: number) {
		const worker = await this.Prisma.worker.findUnique({
			where: { id }
		});
		if (!worker) {
			throw new Error(`Worker with this id ${id} not found`);
		}
		return worker;
	}

	async update(id: number, updateWorkerDto: UpdateWorkerDto) {
		const updateworker = await this.Prisma.worker.findUnique({
			where: { id }
		});
		if (!updateworker) {
			throw new Error(`Worker with this id ${id} not found`);
		}
		const updatedWorker = await this.Prisma.worker.update({
			where: { id },
			data: updateWorkerDto
		});
		return updatedWorker;
	}

	async remove(id: number) {
		const deleteworker = await this.Prisma.worker.findUnique({
			where: { id }
		});
		if (!deleteworker) {
			throw new Error(`Worker with this id ${id} not found`);
		}
		return this.Prisma.worker.delete({
			where: { id }
		});
	}
}
