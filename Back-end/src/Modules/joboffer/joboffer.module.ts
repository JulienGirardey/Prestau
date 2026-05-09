import { Module } from '@nestjs/common';
import { JobofferService } from './joboffer.service';
import { JobofferController } from './joboffer.controller';
import { PrismaService } from '../../prisma.service';
import { JobSchedulerService } from './joboffer_scheduler.service';

@Module({
  controllers: [JobofferController],
  providers: [JobofferService, PrismaService, JobSchedulerService],
})
export class JobofferModule {}
