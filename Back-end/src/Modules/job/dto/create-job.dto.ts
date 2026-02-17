import { IsString, IsNumber, IsDateString} from 'class-validator';

export class CreateJobDto {
	@IsString()
	title!: string;

	@IsString()
  description!: string;

	@IsNumber()
  salary!: number;

	@IsString()
	address!: string;

	@IsDateString()
  start_time!: string;

	@IsDateString()
  end_time!: string;

	@IsNumber()
	companyId!: number;
};
