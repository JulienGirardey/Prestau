import {
  IsInt,
  Min,
  Max,
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
} from "class-validator";

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  comment?: string;

  @IsInt()
  jobId!: number;

  @IsString()
  reviewerType!: string;

  @IsInt()
  reviewerId!: number;

  @IsString()
  revieweeType!: string;

  @IsInt()
  revieweeId!: number;
}
