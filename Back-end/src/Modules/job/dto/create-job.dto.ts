import { IsString, IsNumber, IsDateString, IsNotEmpty} from 'class-validator';

export class CreateJobDto {
	@IsString()
	@IsNotEmpty({ message: 'Le titre de l\'emploi est obligatoire.' })
	title!: string;

	@IsString()
	@IsNotEmpty({ message: 'La description de l\'emploi est obligatoire.' })
  description!: string;

	@IsNumber()
	@IsNotEmpty({ message: 'Le salaire de l\'emploi est obligatoire.' })
  salary!: number;

	@IsString()
	@IsNotEmpty({ message: 'L\'adresse de l\'emploi est obligatoire.' })
	address!: string;

	@IsDateString()
	@IsNotEmpty({ message: 'La date de début de l\'emploi est obligatoire.' })
  start_time!: string;

	@IsDateString()
	@IsNotEmpty({ message: 'La date de fin de l\'emploi est obligatoire.' })
  end_time!: string;
};
