import { Module } from '@nestjs/common';
import { JobofferService } from './joboffer.service';
import { JobofferController } from './joboffer.controller';

@Module({
  controllers: [JobofferController],
  providers: [JobofferService],
})
export class JobofferModule {}
