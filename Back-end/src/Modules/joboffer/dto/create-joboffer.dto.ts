import { IsInt } from "class-validator";

export class CreateJobofferDto {
	@IsInt()
	job_id!: number;
}
