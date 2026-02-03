import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateJobDto {
	@IsString()
	title!: string;

	@IsString()
  description!: string;

	@IsNumber()
  salary!: number;

	@IsString()
	addres!: string;

	@IsNumber()
  @IsOptional()
  latitude?: number;

	@IsNumber()
  @IsOptional()
  longitude?: number;

	@IsDate()
  start_time!: Date;

	@IsDate()
  end_time!: Date;

	@IsNumber()
  companyId!: number;

	@IsString()
  status!: string;
};
