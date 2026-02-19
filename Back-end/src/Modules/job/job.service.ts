import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class JobService {
	constructor(private Prisma: PrismaService) { }

	async create(createJobDto: CreateJobDto) {
		return this.Prisma.job.create({
			data: createJobDto,
		});
	}

	findAll() {
		return this.Prisma.job.findMany();
	}

	findOne(id: number) {
		return this.Prisma.job.findUnique({
			where: { id },
		});

	}

	update(id: number, updateJobDto: UpdateJobDto) {
		return this.Prisma.job.update({
			where: { id },
			data: updateJobDto,
		});
	}

	remove(id: number) {
		return this.Prisma.job.delete({
			where: { id },
		});
	}
}
