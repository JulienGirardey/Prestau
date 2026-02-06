import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsOptional, IsString } from "class-validator"

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
	@IsString()
	companyName!: string;

	@IsString()
	address!: string;

	@IsString()
	establishment_type!: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	website?: string;
	
	@IsString()
	social_media!: string;
};
