import { IsNumber, IsString, IsDate, IsBoolean, IsOptional } from 'class-validator';

export class CreateWorkerDto {
    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsDate()
    @IsOptional()
    dateOfBirth?: Date;

    @IsString()
    city!: string;

    @IsString()
    postalCode!: string;

    @IsOptional()
    @IsString()
    photoURL?: string;

    @IsString()
    profession!: string;

    @IsOptional()
    @IsNumber()
    experience_years?: number;

    @IsString()
    languages!: string;

    @IsOptional()
    @IsString()
    qualifications?: string;

    @IsString()
    @IsOptional()
    cv_url?: string;

    @IsOptional()
    @IsBoolean()
    availability?: boolean;

    @IsString()
    phoneNumber!: string;

    @IsString()
    skills!: string;
}
