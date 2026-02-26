import { Role } from '../enums/role.enum';
import { Request } from 'express';

export interface JwtPayload {
	sub: number;
	email: string;
	role: Role;
}

export interface CurrentUserRequest extends Request {
	user: {
		id: number;
		email: string;
		role: Role;
	};
}
