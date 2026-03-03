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

		// Génère un refresh token avec une durée de vie plus longue (ex: 7 jours)
		const refreshToken = this.jwtService.sign({
			sub: user.id,
		}, { expiresIn: '7d' });

		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

		//mise à jour du refresh token dans la DB pour ce user
		const updatedUser = await this.prisma.users.update({
			where: { id: user.id },
			data: { refreshToken: hashedRefreshToken },
		});

		return {
			access_token,
			refreshToken: updatedUser.refreshToken, // on retourne le refresh token en clair pour le stocker côté client, mais on stocke sa version hashée en DB pour plus de sécurité
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

	// DECONNEXION
	async logout(userId: number) {
		// vérifie que le user existe toujours dans la DB avec l'id du token (userId)
		const user = await this.prisma.users.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new UnauthorizedException('User not found');
		}
		// supprime le refresh token de la DB pour ce user
		// le user ne pourra plus rafraîchir son token et devra se reconnecter pour obtenir un nouveau token d'accès
		await this.prisma.users.update({
			where: { id: userId },
			data: { refreshToken: null },
		});

		return { message: 'Logout successful' };
	}

	// REFRESH TOKEN
	async refreshToken(refreshToken: string) {
		try {
			// Vérifie que le refresh token est valide et correspond à celui stocké dans la DB
			const payload = this.jwtService.verify(refreshToken);
			// Récupère le user depuis la DB avec l'id du token (payload.sub)
			const user = await this.prisma.users.findUnique({
				where: { id: payload.sub },
			});

			if (!user || user.refreshToken !== refreshToken) {
				throw new UnauthorizedException('Invalid refresh token');
			}

			// genère un nouveau token d'accès et un nouveau refresh token
			const newAccessToken = this.jwtService.sign({
				email: user.email,
				sub: user.id,
				role: user.role,
			});
			const newRefreshToken = this.jwtService.sign({
				sub: user.id,
			}, { expiresIn: '7d' });

			// met à jour le refresh token dans la DB
			await this.prisma.users.update({
				where: { id: user.id },
				data: { refreshToken: newRefreshToken },
			});

			return {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			};
		} catch (error) {
			throw new UnauthorizedException('Invalid refresh token');
		}
	}
};
