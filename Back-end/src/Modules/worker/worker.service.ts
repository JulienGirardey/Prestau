import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PrismaService } from '../../prisma.service';
import { Worker } from '@prisma/client';

	@Injectable()
	export class WorkerService { 
  constructor(private Prisma: PrismaService) {}

  async create(createWorkerDto: CreateWorkerDto): Promise<Worker> {
    return this.Prisma.worker.create({ data: createWorkerDto });
  }

  findAll() {
		return this.Prisma.worker.findMany()
  }

  findOne(id: number) {
    return this.Prisma.worker.findUnique({
			where: { id }
		});
  }

  update(id: number, updateWorkerDto: UpdateWorkerDto) {
    return this.Prisma.worker.update({
			where: { id },
			data: updateWorkerDto
		})
  }

  remove(id: number) {
    return this.Prisma.worker.delete({
			where : { id }
		})
  }
}
