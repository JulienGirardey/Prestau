import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6) // Minimum length for password is 6 characters
  password!: string;

  @IsString()
  @IsIn(['COMPANY', 'WORKER']) // Role must be either 'COMPANY' or 'WORKER'
  role!: string;
}
