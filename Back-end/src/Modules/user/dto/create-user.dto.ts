import { IsString, IsBoolean, IsOptional} from 'class-validator';

export class CreateUserDto {
    @IsString()
    email!: string;

    @IsString()
    password!: string;

    @IsString()
    role!: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
