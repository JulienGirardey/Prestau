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
@UseGuards(JwtAuthGuard, RolesGuard) // Applique le guard d'authentification JWT à tous les endpoints
export class WorkerController {
    constructor(private readonly workerService: WorkerService) { }

    @Post() // Créer son profil worker
    @Roles(Role.WORKER) 
    create(@Body() createWorkerDto: CreateWorkerDto, @Req() req: CurrentUserRequest) {
        return this.workerService.create(createWorkerDto, req.user.id);
    }

    @Get('MyProfile') // Un worker peut voir son propre profil
    @Roles(Role.WORKER)
    findMyProfile(@Req() req: CurrentUserRequest) {
        return this.workerService.findOneByUserId(req.user.id);
    }

    @Get('availability') 
    @Roles(Role.WORKER) // Seul le worker peut récupérer ses propres disponibilités
    getAvailability(@Req() req: CurrentUserRequest) {
        // Appel de la méthode du service en passant l'ID de l'utilisateur extrait du token JWT
        return this.workerService.getAvailability(req.user.id);
    }

    @Patch('availability')
    @Roles(Role.WORKER) // Seul le worker peut modifier son propre calendrier
    updateAvailability(
        @Body() body: { date: string; status: string }, 
        @Req() req: CurrentUserRequest
    ) {
        // Transmission de l'ID utilisateur, de la date ciblée et du nouveau statut ('free', 'busy', 'neutral')
        return this.workerService.updateAvailability(req.user.id, body.date, body.status);
    }

    @Get(':id') // Une company peut voir un worker spécifique par son ID
    @Roles(Role.COMPANY) 
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.workerService.findOne(id);
    }

    @Patch('MyProfile') // Un worker peut mettre à jour son propre profil
    @Roles(Role.WORKER)
    update(@Body() updateWorkerDto: UpdateWorkerDto, @Req() req: CurrentUserRequest) {
        return this.workerService.update(req.user.id, updateWorkerDto);
    }

    @Delete('MyProfile') // Un worker peut supprimer son propre profil
    @Roles(Role.WORKER)
    remove(@Req() req: CurrentUserRequest) {
        return this.workerService.remove(req.user.id);
    }
}