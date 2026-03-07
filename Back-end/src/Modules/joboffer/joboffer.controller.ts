import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import { JobofferService } from "./joboffer.service";
import { CreateJobofferDto } from "./dto/create-joboffer.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Role } from "../auth/enums/role.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CurrentUserRequest } from "../auth/interfaces/jwt-payload.interface";

@Controller("joboffer")
@UseGuards(JwtAuthGuard, RolesGuard) // Appliquer le guard d'authentification JWT à toutes les routes de ce contrôleur
export class JobofferController {
  constructor(private readonly jobofferService: JobofferService) { }

  @Post(":jobId")
  @Roles(Role.WORKER) // seulement un Worker peut créer une offre d'emploi
  create(
    @Param("jobId", ParseIntPipe) jobId: number,
    @Body() createJobofferDto: CreateJobofferDto,
    @Req() req: CurrentUserRequest,
  ) {
    return this.jobofferService.create(createJobofferDto, req.user.id, jobId); // Associer l'offre d'emploi créée à l'utilisateur qui l'a créée (même token)
  }

  @Post(":id/accept")
  @Roles(Role.COMPANY) // seulement une Company peut accepter une offre d'emploi
  accept(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: CurrentUserRequest,
  ) {
    return this.jobofferService.accept(id, req.user.id); // Associer l'offre d'emploi acceptée à l'utilisateur qui l'accepte (même token)
  }

  @Post(":id/reject")
  @Roles(Role.COMPANY) // seulement une Company peut rejeter une offre d'emploi
  reject(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: CurrentUserRequest,
  ) {
    return this.jobofferService.reject(id, req.user.id); // Associer l'offre d'emploi rejetée à l'utilisateur qui la rejette (même token)
  }

  @Post(":id/complete")
  @Roles(Role.COMPANY) // seulement une Company peut compléter une offre d'emploi
  complete(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: CurrentUserRequest,
  ) {
    return this.jobofferService.complete(id, req.user.id); // Associer l'offre d'emploi complétée à l'utilisateur qui la complète (même token)
  }

  @Get("my-offers")
	@Roles(Role.COMPANY) // Seule la company peut récupérer ses propres offres d'emploi
  async getMyJobOffers(@Req() req: CurrentUserRequest) {
    const userId = req.user.id;
    return this.jobofferService.findByCompany(userId);
  }

  @Get('my-applications')
  @Roles(Role.WORKER) // Seul le worker peut récupérer ses propres candidatures
  findMyApplications(@Req() req: CurrentUserRequest) {
    return this.jobofferService.findMyApplications(req.user.id);
  }

  @Get()
  findAll() {
    return this.jobofferService.findAll();
  }

  @Get('history')
  findHistory(@Req() req: any) {
    return this.jobofferService.findHistory(req.user.id, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobofferService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.jobofferService.remove(id);
  }
}
