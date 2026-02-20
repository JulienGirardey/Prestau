import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Users } from "@prisma/client";
import { PrismaService } from "../../prisma.service";
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class UserService {
  constructor(private Prisma: PrismaService) {}

  async findOne(id: number): Promise<Omit<Users, "password">> {
    const user = await this.Prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with this ID ${id} not found`);
    }
    return user;
  }

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
    });
  }

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
      },
    });
  }
}
