import { Injectable } from '@nestjs/common';
import { CreateJobofferDto } from './dto/create-joboffer.dto';

@Injectable()
export class JobofferService {
  create(createJobofferDto: CreateJobofferDto) {
    return 'This action adds a new joboffer';
  }

  findAll() {
    return `This action returns all joboffer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} joboffer`;
  }

  remove(id: number) {
    return `This action removes a #${id} joboffer`;
  }
}
