// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaService } from './prisma.service';

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
	],
	controllers: [],
	providers: [PrismaService],
	exports: [PrismaService],
})
export class AppModule { }