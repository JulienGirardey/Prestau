// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaService } from './prisma.service';
import { JobModule } from './Modules/job/job.module';
import { WorkerModule } from './Modules/worker/worker.module';
import { JobofferModule } from './Modules/joboffer/joboffer.module';
import { CompanyModule } from './Modules/company/company.module';
import { UserModule } from './Modules/user/user.module';
import { ReviewModule } from './Modules/review/review.module';
import { MessageModule } from './Modules/message/message.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test')
					.default('development'),
				PORT: Joi.number().default(3000),
				DATABASE_URL: Joi.string().required(),
			}),
		}),
		JobModule,
		WorkerModule,
		JobofferModule,
		CompanyModule,
		UserModule,
		ReviewModule,
		MessageModule,
	],
	controllers: [],
	providers: [PrismaService],
	exports: [PrismaService],
})
export class AppModule { }