import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { JobofferService } from './joboffer.service';
import { CreateJobofferDto } from './dto/create-joboffer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUserRequest } from '../auth/interfaces/jwt-payload.interface';

@Controller('joboffer')
@UseGuards(JwtAuthGuard, RolesGuard) // Appliquer le guard d'authentification JWT à toutes les routes de ce contrôleur
export class JobofferController {
  constructor(private readonly jobofferService: JobofferService) {}

  @Post(':jobId')
  @Roles(Role.WORKER) // seulement un Worker peut créer une offre d'emploi
  create(@Param('jobId', ParseIntPipe) jobId: number, @Body() createJobofferDto: CreateJobofferDto, @Req() req: CurrentUserRequest) {
    return this.jobofferService.create(createJobofferDto, req.user.id, jobId); // Associer l'offre d'emploi créée à l'utilisateur qui l'a créée (même token)
  }

  @Get('my-offers')
  @Roles(Role.WORKER)
  async getMyJobOffers(@Req() req: CurrentUserRequest) {
    const userId = req.user.id; 
    return this.jobofferService.findByUserId(userId);
  }

  @Get()
  findAll() {
    return this.jobofferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobofferService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobofferService.remove(id);
  }
}
