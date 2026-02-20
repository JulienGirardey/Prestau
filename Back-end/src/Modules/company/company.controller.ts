import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUserRequest } from '../auth/interfaces/jwt-payload.interface';

@Controller('company')
@UseGuards(JwtAuthGuard) // Appliquer le guard d'authentification JWT à toutes les routes de ce contrôleur
@UseGuards(RolesGuard) // guard de rôle pour vérifier que l'utilisateur a le rôle de company
export class CompanyController {
	constructor(private readonly companyService: CompanyService) { }

	@Post()
	@Roles(Role.COMPANY) // seulement une company peut créer son profil company
	create(@Body() createCompanyDto: CreateCompanyDto, @Req() req: CurrentUserRequest) {
		return this.companyService.create(createCompanyDto, req.user.id); // Associer la company créée à l'utilisateur qui l'a créée (même token)
	}

	@Get('MyCompany') // une company peut voir son profil company
	@Roles(Role.COMPANY)
	findMyCompany(@Req() req: CurrentUserRequest) {
		return this.companyService.findOneByUserId(req.user.id);
	}

	@Get(':id') // un workeur peut voir une company par ID
	@Roles(Role.WORKER)
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.companyService.findOne(id);
	}

	@Patch('MyCompany') // une company peut mettre à jour son profil company
	@Roles(Role.COMPANY)
	update(@Body() updateCompanyDto: UpdateCompanyDto, @Req() req: CurrentUserRequest) {
		return this.companyService.update(req.user.id, updateCompanyDto);
	}

	@Delete('MyCompany') // une company peut supprimer son profil
	@Roles(Role.COMPANY)
	remove(@Req() req: CurrentUserRequest) {
		return this.companyService.remove(req.user.id);
	}
}
