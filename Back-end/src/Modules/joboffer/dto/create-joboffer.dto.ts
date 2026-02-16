import { Type } from "class-transformer";
import { IsString, IsInt, IsOptional, IsDateString, IsPositive } from "class-validator";

export class CreateJobofferDto {
    @IsInt()
	@IsPositive()
    jobId!: number;

    @IsInt()
	@IsPositive()
    workerId!: number;

    @IsString()
    @IsOptional()
    contract_url?: string;

    @IsDateString()
    @IsOptional()
	@Type(() => Date)
    startDate?: string;

    @IsDateString()
    @IsOptional()
	@Type(() => Date)
    endDate?: string;
}
