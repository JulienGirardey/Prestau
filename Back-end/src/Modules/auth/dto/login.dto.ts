import { IsEmail, IsEnum, IsIn, IsString, MinLength } from 'class-validator';
import { Role } from '../enums/role.enum';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

	@IsEnum(Role)
	role!: Role;
}
