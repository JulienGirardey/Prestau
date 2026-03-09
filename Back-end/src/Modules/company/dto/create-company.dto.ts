import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator"

export class CreateCompanyDto {
	@IsString()
	@IsNotEmpty({ message: 'Le nom de l\'entreprise est obligatoire.' })
	companyName!: string;

	@IsString()
	@IsNotEmpty({ message: 'L\'adresse est obligatoire.' })
	address!: string;

	@IsString()
	@IsNotEmpty({ message: 'La ville est obligatoire.' })
	city!: string;

	@IsNumber()
	@IsNotEmpty({ message: 'Le code postal est obligatoire.' })
	postalCode!: number;

	@IsString()
	@IsNotEmpty({ message: 'Le numéro SIRET est obligatoire.' })
	siret!: string;

	@IsString()
	@IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire.' })
	phoneNumber!: string;

	@IsString()
	@IsNotEmpty({ message: 'Le type d\'établissement est obligatoire.' })
	establishment_type!: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsOptional()
	@IsUrl({}, { message: 'Le champ website doit être une URL valide.' })
	website?: string;

	@IsOptional()
	@IsUrl({}, { message: 'Le champ social_media doit être une URL valide.' })
	social_media?: string;
};
