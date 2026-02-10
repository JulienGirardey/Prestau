import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateCompanyDto {
	@IsString()
	companyName!: string;

	@IsString()
	address!: string;

	@IsString()
	siret!: string;

	@IsString()
	establishment_type!: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	website?: string;

	@IsString()
	@IsOptional()
	social_media?: string;

	@IsNumber()
	userId!: number;
};
