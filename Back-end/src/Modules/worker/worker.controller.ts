import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUserRequest } from '../auth/interfaces/jwt-payload.interface';

@Controller('worker')
@UseGuards(JwtAuthGuard) // Apply JWT authentication guard to all routes in this controller
export class WorkerController {
	constructor(private readonly workerService: WorkerService) { }

	@Post() // Créer son profil worker
	@Roles(Role.WORKER) // seulement un worker peut créer son profil worker
	@UseGuards(RolesGuard) // guard de rôle pour vérifier que l'utilisateur a le rôle de worker
	create(@Body() createWorkerDto: CreateWorkerDto, @Req() req: CurrentUserRequest) {
		return this.workerService.create(createWorkerDto, req.user.id);
	}

	@Get('MyProfile') // un worker peut voir son profil
	@Roles(Role.WORKER)
	@UseGuards(RolesGuard)
	findMyProfile(@Req() req: CurrentUserRequest) {
		return this.workerService.findOneByUserId(req.user.id);
	}

	@Get(':id') // une company peut voir un worker par ID
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.workerService.findOne(id);
	}

	@Patch('MyProfile') // un worker peut mettre à jour son profil worker
	@Roles(Role.WORKER)
	@UseGuards(RolesGuard)
	update(@Body() updateWorkerDto: UpdateWorkerDto, @Req() req: CurrentUserRequest) {
		return this.workerService.update(updateWorkerDto, req.user.id);
	}

	@Delete('MyProfile') // un worker peut supprimer son profil worker
	@Roles(Role.WORKER)
	@UseGuards(RolesGuard)
	remove(@Req() req: CurrentUserRequest) {
		return this.workerService.remove(req.user.id);
	}
}
