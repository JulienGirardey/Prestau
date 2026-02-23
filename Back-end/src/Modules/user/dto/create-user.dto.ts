import { IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
    @IsString()
	@IsEmail()
    email!: string;

    @IsString()
    password!: string;

    @IsString()
	@IsEnum(Role)
    role!: Role;
}
