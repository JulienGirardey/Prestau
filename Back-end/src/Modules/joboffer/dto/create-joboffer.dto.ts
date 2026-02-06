import { IsString } from "class-validator";

export class CreateJobofferDto {
	@IsString()
	contract_url!: string;
}
