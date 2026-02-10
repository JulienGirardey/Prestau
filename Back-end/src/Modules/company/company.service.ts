import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CompanyService {
  constructor(private Prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.Prisma.company.create({
      data: createCompanyDto,
    });
  }

  findAll(): Promise<Company[]> {
    return this.Prisma.company.findMany();
  }

  findOne(id: number) {
    return this.Prisma.company.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return this.Prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  remove(id: number) {
    return this.Prisma.company.delete({
      where: { id },
    });
  }
}
