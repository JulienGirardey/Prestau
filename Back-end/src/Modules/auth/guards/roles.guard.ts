import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // classe utilitaire pour récupérer les métadonnées de @Roles()

  canActivate(context: ExecutionContext): boolean {
    // Récupère les rôles requis pour cette route depuis le décorateur @Roles()
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // Si pas de @Roles(), laisser passer tous les rôles
    if (!roles) {
      return true;
    }
    // Récupère req.user (ajouté par JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Vérifie si le rôle du user est dans les rôles autorisés
    return roles.includes(user.role);
  }
};
