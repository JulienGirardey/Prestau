import { IsEmail, IsString, MinLength, IsEnum, MaxLength, Matches } from 'class-validator';
import { Role } from '../enums/role.enum';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }) // Minimum length for password is 8 characters
	@MaxLength(20, { message: 'Le mot de passe ne doit pas dépasser 20 caractères' }) // Maximum length for password is 20 characters
	@Matches(/[^A-Za-z0-9]/, { message: 'Le mot de passe doit contenir au moins un caractère spécial' }) // Password must contain at least one special character
	@Matches(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une lettre majuscule' }) // Password must contain at least one uppercase letter
	@Matches(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une lettre minuscule' }) // Password must contain at least one lowercase letter
	@Matches(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' }) // Password must contain at least one digit
  password!: string;

  @IsEnum(Role) //WORKER or COMPANY
  role!: Role;
}
