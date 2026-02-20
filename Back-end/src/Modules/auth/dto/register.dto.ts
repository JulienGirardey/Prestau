import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6) // Minimum length for password is 6 characters
  password!: string;

  @IsEnum(Role) //WORKER or COMPANY
  role!: Role;
}
