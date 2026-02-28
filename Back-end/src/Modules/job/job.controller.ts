import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUserRequest } from '../auth/interfaces/jwt-payload.interface';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('job')
@UseGuards(JwtAuthGuard) // Applique le guard d'authentification à toutes les routes de ce contrôleur
export class JobController {
	constructor(private readonly jobService: JobService) { }

	@Post()
	//@UseGuards(RolesGuard) // pour vérifier que l'utilisateur a le rôle de company
	@Roles(Role.COMPANY) // Seules les entreprises peuvent créer des emplois
	create(@Body() createJobDto: CreateJobDto, @Req() req: CurrentUserRequest) {
		return this.jobService.create(createJobDto, req.user.id);
	}

	@Get()
	findAll(@Req() req: CurrentUserRequest) {
		return this.jobService.findAll(req.user);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.jobService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(RolesGuard) // pour vérifier que l'utilisateur a le rôle de company
	@Roles(Role.COMPANY) // Seules les entreprises peuvent mettre à jour des emplois
	update(@Param('id', ParseIntPipe) id: number, @Body() updateJobDto: UpdateJobDto, @Req() req: CurrentUserRequest) {
		return this.jobService.update(id, updateJobDto, req.user.id);
	}

	@Delete(':id')
	@UseGuards(RolesGuard) // pour vérifier que l'utilisateur a le rôle de company
	@Roles(Role.COMPANY) // Seules les entreprises peuvent supprimer leur proposition d'emploi
	remove(@Param('id', ParseIntPipe) id: number, @Req() req: CurrentUserRequest) {
		return this.jobService.remove(id, req.user.id);
	}
}
