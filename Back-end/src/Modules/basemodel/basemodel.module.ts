import { Module } from '@nestjs/common';
import { BasemodelService } from './basemodel.service';
import { PrismaService } from '../../prisma.service';

@Module({
  providers: [BasemodelService, PrismaService],
})
export class BasemodelModule {}
