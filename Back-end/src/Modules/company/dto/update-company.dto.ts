import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsOptional, IsString } from "class-validator"

export class UpdateCompanyDto {
	@IsString()
	@IsOptional()
	companyName!: string;

	@IsString()
	@IsOptional()
	address!: string;

	@IsString()
	@IsOptional()
	establishment_type!: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	website?: string;
	
	@IsString()
	@IsOptional()
	social_media!: string;
};
