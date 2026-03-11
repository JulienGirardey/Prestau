import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Users } from "@prisma/client";
import { PrismaService } from "../../prisma.service";
import { Role } from "../auth/enums/role.enum";

@Injectable()
export class UserService {
  constructor(private Prisma: PrismaService) {}

	// Un utilisateur peut récupérer ses informations (sans le mot de passe)
  async findOne(id: number): Promise<Omit<Users, "password">> {
    const user = await this.Prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        refreshToken: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with this ID ${id} not found`);
    }
    return user;
  }

	// Un utilisateur peut mettre à jour son email et son rôle (admin uniquement)
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<Users, "password">> {
    const user = await this.Prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.email) {
      const existingUser = await this.Prisma.users.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(`This email is already in use`);
      }
    }

    return this.Prisma.users.update({
      where: { id },
      data: {
        ...updateUserDto,
        role: updateUserDto.role as Role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        refreshToken: true,
      },
    });
  }

	// Un utilisateur peut supprimer son compte
  async remove(id: number): Promise<Omit<Users, "password">> {
    const user = await this.Prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with this ID ${id} not found`);
    }

    return this.Prisma.users.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        refreshToken: true,
      },
    });
  }
}
