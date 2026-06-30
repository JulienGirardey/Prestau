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

	// ===================INSCRIPTION===================
	// Cree un nouvel utilisateur en DB, hash son mot de passe,
	// genere un access token (courte duree) et un refresh token (7j).
	async register(registerDto: RegisterDto) {

		// Verifie qu'aucun compte n'existe deja avec cet email
		const existingUser = await this.prisma.users.findUnique({
			where: { email: registerDto.email }
		});
		if (existingUser) {
			throw new ConflictException('This email already exists');
		}

		// Hash le mot de passe avant de le stocker (saltRounds = 10)
		const hashedPassword = await bcrypt.hash(registerDto.password, 10);

		// Cree l'utilisateur en DB (sans refresh token pour l'instant)
		const newUser = await this.prisma.users.create({
			data: {
				email: registerDto.email,
				password: hashedPassword, //Password hashé directement
				role: registerDto.role,
			}
		});

		// Genere l'access token JWT (courte duree, definie dans le module JWT)
		const access_token = this.jwtService.sign({
			email: newUser.email,
			sub: newUser.id,
			role: newUser.role
		});

		// Genere le refresh token avec le vrai id utilisateur (longue duree : 7j)
		const refreshToken = this.jwtService.sign(
			{ sub: newUser.id },
			{ expiresIn: '7d' }
		);

		// Hash le refresh token avant de le stocker en DB (securite en cas de fuite DB)
		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

		// Stocke le refresh token hashe en DB
		await this.prisma.users.update({
			where: { id: newUser.id },
			data: { refreshToken: hashedRefreshToken },
		});

		return {
			access_token,
			refresh_token : refreshToken, // retourne en clair pour etre stocke cote client
			user: {
				id: newUser.id,
				email: newUser.email,
				role: newUser.role,
			}
		};
	}

	// ===================CONNEXION===================
	// Verifie les credentials, s'assure que le profil lie (company/worker)
	// existe bien, puis retourne un access token et un refresh token.
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
			role: user.role,
		});

		// Genere un nouveau refresh token (7j)
		const refreshToken = this.jwtService.sign(
			{ sub: user.id },
			{ expiresIn: '7d' }
		);

		// Hash le refresh token avant de le stocker en DB
		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

		// Met a jour le refresh token hashe en DB
		await this.prisma.users.update({
			where: { id: user.id },
			data: { refreshToken: hashedRefreshToken },
		});

		return {
			access_token,
			refresh_token: refreshToken, // retourne en clair pour etre stocke cote client
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			}
		};
	}

	// ====================VALIDATION JWT===================
	// Utilise par la JwtStrategy pour recuperer l'utilisateur
	// a partir de son id (payload.sub du JWT).
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

	// ===================DECONNEXION===================
	// Supprime le refresh token en DB => le user ne pourra plus
	// renouveler son access token sans se reconnecter.
	async logout(userId: number) {

		// Verifie que le user existe toujours
		const user = await this.prisma.users.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		// Invalide le refresh token en le supprimant de la DB
		await this.prisma.users.update({
			where: { id: userId },
			data: { refreshToken: null },
		});

		return { message: 'Logout successful' };
	}

	// ===================REFRESH TOKEN===================
	// Verifie que le refresh token fourni est valide et correspond
	// bien au hash stocke en DB, puis genere une nouvelle paire de tokens
	// (rotation de refresh token pour limiter les risques de vol).
	async refreshToken(refreshToken: string) {
		try {
			// Verifie la signature et l'expiration du refresh token
			const payload = this.jwtService.verify(refreshToken);
			// Récupère le user depuis la DB avec l'id du token (payload.sub)
			const user = await this.prisma.users.findUnique({
				where: { id: payload.sub },
			});

			// Verifie qu'un refresh token existe en DB pour ce user
			if (!user || !user.refreshToken) {
				throw new UnauthorizedException('Invalid refresh token');
			}

			// Compare le token fourni avec le hash stocke en DB
			const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
			if (!isRefreshTokenValid) {
				throw new UnauthorizedException('Invalid refresh token');
			}

			// Genere un nouvel access token
			const newAccessToken = this.jwtService.sign({
				email: user.email,
				sub: user.id,
				role: user.role,
			});

			// Genere un nouveau refresh token (rotation du token)
			const newRefreshToken = this.jwtService.sign(
				{ sub: user.id },
				{ expiresIn: '7d' }
			);

			// Hash le nouveau refresh token avant de le stocker en DB
			const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

			// met à jour le refresh token dans la DB
			await this.prisma.users.update({
				where: { id: user.id },
				data: { refreshToken: hashedNewRefreshToken },
			});

			return {
				access_token: newAccessToken,
				refresh_token: newRefreshToken, // retourne en clair pour le client
			};

		} catch (error) {
			// Couvre les cas : token expire, signature invalide, user introuvable
			throw new UnauthorizedException('Invalid refresh token');
		}
	}
}
