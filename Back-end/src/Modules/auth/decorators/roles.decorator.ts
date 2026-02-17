import { SetMetadata } from '@nestjs/common';

// crée le décorateur Rôle() qui stocke les rôles autorisés sur une route
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
