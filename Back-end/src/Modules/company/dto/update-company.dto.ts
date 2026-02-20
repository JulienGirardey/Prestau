import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateCompanyDto extends PartialType(OmitType(CreateCompanyDto, ['siret'] as const))
{ };
