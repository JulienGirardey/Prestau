import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateJobofferDto } from './dto/create-joboffer.dto';
import { PrismaService } from '../../prisma.service';
import { JobOffer } from '@prisma/client';

@Injectable()
export class JobofferService {
    constructor(private Prisma: PrismaService) { }

    async create(createJobofferDto: CreateJobofferDto, userId: number, jobId: number): Promise<JobOffer> {
        const workerProfile = await this.Prisma.worker.findUnique({
            where: { userId },
        });

        if (!workerProfile) {
            throw new NotFoundException('Worker profile not found for this user.');
        }

        const existingJobOffer = await this.Prisma.jobOffer.findFirst({
            where: { 
                workerId: workerProfile.id,
                jobId: jobId 
            },
        });

        if (existingJobOffer) {
            throw new ConflictException('You have already applied for this job.');
        }

        return this.Prisma.jobOffer.create({
            data: {
                ...createJobofferDto,
                workerId: workerProfile.id, 
                jobId: jobId,
            },
        });
    }

    async findByUserId(userId: number): Promise<JobOffer[]> {
        return this.Prisma.jobOffer.findMany({
            where: {
                worker: {
                    userId: userId
                }
            },
            include: {
                job: true,
            },
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
        await this.findOne(id);
        
        return this.Prisma.jobOffer.delete({
            where: { id },
        });
    }
}