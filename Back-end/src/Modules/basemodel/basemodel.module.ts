import { Module } from '@nestjs/common';
import { BasemodelService } from './basemodel.service';
import { BasemodelController } from './basemodel.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  providers: [BasemodelService, PrismaService],
  controllers: [BasemodelController],
})
export class BasemodelModule {}
