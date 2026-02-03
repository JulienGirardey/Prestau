import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsString } from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {
	@IsString()
	status!: string;
};
