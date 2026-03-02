import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) { }

	// INSCRIPTION
	async register(registerDto: RegisterDto) {
		const existingUser = await this.prisma.users.findUnique({
			where: { email: registerDto.email }
		});
		if (existingUser) {
			throw new ConflictException('This email already exists');
		}
		// hashe le mot de passe
		const hashedPassword = await bcrypt.hash(registerDto.password, 10);

		// crée un nouvel utilisateur dans la db
		const newUser = await this.prisma.users.create({
			data: {
				email: registerDto.email,
				password: hashedPassword, //Password hashé directement
				role: registerDto.role,
			}
		});
		// Génère le token JWT avec sign()
		const access_token = this.jwtService.sign({
			email: newUser.email,
			sub: newUser.id,
			role: newUser.role
		});

		return {
			access_token,
			user: {
				id: newUser.id,
				email: newUser.email,
				role: newUser.role,
			}
		};
	}

	//CONNEXION
	async login(loginDto: LoginDto) {
		// Trouve le user par son email
		const user = await this.prisma.users.findUnique({
			where: { email: loginDto.email }
		});
		// Check si le user existe
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		// Compare le password fourni avec le password hashé dans la DB
		const isPasswordValid = await bcrypt.compare(
			loginDto.password,
			user.password
		);
		// Check si le password est valide
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// si le user est une COMPANY, vérifie qu'elle a bien créé son profil company avant de pouvoir se connecter
		if (user.role === 'COMPANY') {
			const company = await this.prisma.company.findUnique({
				where: { userId: user.id }
			});

			if (!company) {
				throw new UnauthorizedException('Company profile not created yet');
			}
		}

		// si le user est un WORKER, vérifie qu'il a bien créé son profil worker avant de pouvoir se connecter
		if (user.role === 'WORKER') {
			const worker = await this.prisma.worker.findUnique({
				where: { userId: user.id }
			});

			if (!worker) {
				throw new UnauthorizedException('Worker profile not created yet');
			}
		}

		// Génère le token JWT avec sign()
		const access_token = this.jwtService.sign({
			email: user.email,
			sub: user.id,
			role: user.role
		});

		return {
			access_token,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			}
		};
	}

	// Valide le token JWT et retourne les infos de l'utilisateur
	async validateUser(userId: number) {
		return this.prisma.users.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				role: true,
			}
		});
	}
};
