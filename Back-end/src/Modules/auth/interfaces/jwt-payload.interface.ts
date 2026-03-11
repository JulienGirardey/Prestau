import { Role } from '../enums/role.enum';
import { Request } from 'express';

// Interface pour le payload du JWT
export interface JwtPayload {
	sub: number;
	email: string;
	role: Role;
}

// Interface pour req.user après validation du JWT
export interface CurrentUserRequest extends Request {
	user: {
		id: number;
		email: string;
		role: Role;
	};
}
