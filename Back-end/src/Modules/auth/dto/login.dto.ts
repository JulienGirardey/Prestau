import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsIn(['COMPANY', 'WORKER'])
  role!: string;
}
