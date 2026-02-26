import { IsNumber, IsString, IsDate, IsBoolean, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateWorkerDto {
	@IsString()
	@IsNotEmpty({ message: 'Le prénom est obligatoire.' })
	firstName!: string;

	@IsString()
	@IsNotEmpty({ message: 'Le nom est obligatoire.' })
	lastName!: string;

	@IsOptional()
	@IsDate({ message: 'La date de naissance doit être une date valide.' })
	dateOfBirth?: Date;

	@IsString()
	@IsNotEmpty({ message: 'La ville est obligatoire.' })
	city!: string;

	@IsNumber()
	@IsNotEmpty({ message: 'Le code postal est obligatoire.' })
	postalCode!: number;

	@IsOptional()
	@IsUrl({}, { message: 'Le champ photoURL doit être une URL valide.' })
	photoURL?: string;

	@IsString()
	@IsNotEmpty({ message: 'La profession est obligatoire.' })
	profession!: string;

	@IsOptional()
	@IsNumber()
	experience_years?: number;

	@IsString()
	@IsNotEmpty({ message: 'Le champ langues est obligatoire.' })
	languages!: string;

	@IsOptional()
	@IsString()
	qualifications?: string;

	@IsOptional()
	@IsUrl({}, { message: 'Le champ cv_url doit être une URL valide.' })
	cv_url?: string;

	@IsOptional()
	@IsBoolean()
	availability?: boolean;

	@IsString()
	@IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire.' })
	phoneNumber!: string;

	@IsString()
	@IsNotEmpty({ message: 'Le champ compétences est obligatoire.' })
	skills!: string;
}
