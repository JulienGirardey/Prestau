import { Module } from '@nestjs/common';
import { JobofferService } from './joboffer.service';
import { JobofferController } from './joboffer.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [JobofferController],
  providers: [JobofferService, PrismaService],
})
export class JobofferModule {}
