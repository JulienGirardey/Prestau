import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CompanyService {
  constructor(private Prisma: PrismaService) { }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const existingCompany = await this.Prisma.company.findUnique({
      where: { userId: createCompanyDto.userId },
    });
    // Check if a company with the same userId already exists
    if (existingCompany) {
      throw new Error('This company already exists');
    }
    // Check if a company with the same companyName already exists
    if (await this.Prisma.company.findFirst({
      where: { companyName: createCompanyDto.companyName }
    })) {
      throw new Error('This company name is already taken');
    }
    // If no existing company is found, create a new one
    return this.Prisma.company.create({
      data: createCompanyDto,
    });
  }

  findAll(): Promise<Company[]> {
    return this.Prisma.company.findMany();
  }

  async findOne(id: number): Promise<Company | null> {
    const company = await this.Prisma.company.findUnique({
      where: { id },
    });
    // If no company is found with the given ID, throw an error
    if (!company) {
      throw new Error(`Company with this ID ${id} not found`);
    }
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.Prisma.company.findUnique({
      where: { id },
    });
    // If no company is found with the given ID, throw an error
    if (!company) {
      throw new Error(`Company with this ID ${id} not found`);
    }
    // If the company exists, proceed to update it
    this.Prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
    return console.log(`Company with this ID ${id} has been updated successfully`);
  }

  async remove(id: number) {
    // Check if the company exists before attempting to delete it
    const company = await this.Prisma.company.findUnique({
      where: { id },
    });
    // If no company is found with the given ID, throw an error
    if (!company) {
      throw new Error(`Company with this ID ${id} not found`);
    }
    // If the company exists, proceed to delete it
    this.Prisma.company.delete({
      where: { id },
    });
    return console.log(`Company with this ID ${id} has been deleted successfully`);
  }
}
