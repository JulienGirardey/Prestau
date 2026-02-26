import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../../prisma.service';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'your-secret-key',
			signOptions: { expiresIn: '7d' },
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		PrismaService,
		JwtStrategy,
	],
	exports: [AuthService],
})
export class AuthModule { }