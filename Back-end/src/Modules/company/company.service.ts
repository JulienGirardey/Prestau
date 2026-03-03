import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CompanyService {
	constructor(private prisma: PrismaService) { }

	// créer une company liée à un utilisateur (userId)
	async create(createCompanyDto: CreateCompanyDto, userId: number): Promise<Company> {
		const existingCompany = await this.prisma.company.findUnique({
			where: { userId },
		});

		if (existingCompany) {
			throw new ConflictException('A company already exists for this user.');
		}

		return this.prisma.company.create({
			data: {
				...createCompanyDto,
				userId, // association de la company avec l'utilisateur qui l'a créé (= même token)
			}
		});
	}

	// trouver une comapny par son userId (pour que la company puisse voir son profil)
	async findOneByUserId(userId: number) {
		const company = await this.prisma.company.findUnique({
			where: { userId }
		});
		// Vérifie si une company avec cet id existe dans la db pour le retourner
		if (!company) {
			throw new NotFoundException(`Company not found`)
		}
		return company;
	}

	// Trouver une company par son id (pour que le worker puisse voir le profil de la company)
	async findOne(id: number) {
		const company = await this.prisma.company.findUnique({
			where: { id },
		});
		// Vérifie si une company avec cet id existe dans la db pour le retourner
		if (!company) {
			throw new NotFoundException(`Company not found`);
		}
		return company;
	}

	// mettre à jour une company par son userId
	async update(userId: number, updateCompanyDto: UpdateCompanyDto) {
		await this.findOneByUserId(userId); // vérifie que la company existe

		return this.prisma.company.update({
			where: { userId },
			data: updateCompanyDto,
		});
	}

	// supprimer une company par son userId
	async remove(userId: number) {
		await this.findOneByUserId(userId); // vérifie que la company existe

		return this.prisma.company.delete({
			where: { userId },
		});
	}
}
