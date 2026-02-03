import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateJobDto {
	@IsString()
	title!: string;

	@IsString()
  description!: string;

	@IsNumber()
  @IsOptional()
  salary!: number | null;

	@IsNumber()
  @IsOptional()
  latitude!: number | null;

	@IsNumber()
  @IsOptional()
  longitude!: number | null;

	@IsDate()
  @IsOptional()
  start_time!: Date | null;

	@IsDate()
  @IsOptional()
  end_time!: Date | null;

	@IsNumber()
  companyId!: number;

	@IsString()
  status!: string;
};
