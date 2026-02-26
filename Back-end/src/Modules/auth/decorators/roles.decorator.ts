import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

// crée le décorateur Roles() qui stocke les rôles autorisés sur une route
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
