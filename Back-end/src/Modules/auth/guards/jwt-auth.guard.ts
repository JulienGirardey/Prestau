import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
// Ce guard utilise la stratégie JWT pour protéger les routes qui nécessitent une authentification