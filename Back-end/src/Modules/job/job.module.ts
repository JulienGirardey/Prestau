import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { PrismaService } from '../../prisma.service';
import { JobSchedulerService } from './job_scheduler.service';

@Module({
  controllers: [JobController],
  providers: [JobService, PrismaService, JobSchedulerService],
})
export class JobModule {}
