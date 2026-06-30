import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsString, IsOptional } from "class-validator";

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ["password"]),
) {}

export class UpdateUserPasswordDto {
  @IsString()
  @IsOptional()
  oldPassword?: string;

  @IsString()
  newPassword!: string;
}
