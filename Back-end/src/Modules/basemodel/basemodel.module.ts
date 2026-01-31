import { Module } from '@nestjs/common';
import { BasemodelService } from './basemodel.service';
import { BasemodelController } from './basemodel.controller';

@Module({
  providers: [BasemodelService],
  controllers: [BasemodelController],
})
export class BasemodelModule {}
