import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUserRequest } from "../auth/interfaces/jwt-payload.interface";

@Controller("user")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("MyProfile") // un utilisateur peut voir son propre profil
  findMyProfile(@Req() req: CurrentUserRequest) {
    return this.userService.findOne(req.user.id);
  }

  @Get(":id") // voir un utilisateur par ID
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch("MyProfile") // un utilisateur peut mettre à jour son propre profil
  updateMyProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: CurrentUserRequest,
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete("MyProfile") // un utilisateur peut supprimer son propre profil
  removeMyProfile(@Req() req: CurrentUserRequest) {
    return this.userService.remove(req.user.id);
  }
}
