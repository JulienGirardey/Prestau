import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './create-worker.dto';

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
    firstName!: string;
    lastName!: string;
    city?: string;
    postalCode?: string;
    photoURL?: string;
    profession?: string;
    experience_years?: number;
    languages?: string;
    qualifications?: string;
    cv_url?: string;
    availability?: boolean;
    phoneNumber?: string;
    skills?: string;
    latitude?: number;
    longitude?: number;
}
