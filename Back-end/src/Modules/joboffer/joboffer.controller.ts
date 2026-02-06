import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobofferService } from './joboffer.service';
import { CreateJobofferDto } from './dto/create-joboffer.dto';

@Controller('joboffer')
export class JobofferController {
  constructor(private readonly jobofferService: JobofferService) {}

  @Post()
  create(@Body() createJobofferDto: CreateJobofferDto) {
    return this.jobofferService.create(createJobofferDto);
  }

  @Get()
  findAll() {
    return this.jobofferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobofferService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobofferService.remove(+id);
  }
}
