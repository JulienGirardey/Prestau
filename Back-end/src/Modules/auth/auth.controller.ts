import { Controller, Post, Body, Req } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service'
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUserRequest } from './interfaces/jwt-payload.interface';

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post("register") // un utilisateur doit pouvoir s'inscrire
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post("login") // un utilisateur doit pouvoir se connecter
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post('logout') // un utilisateur doit pouvoir se déconnecter
	@UseGuards(JwtAuthGuard)
	logout(@Req() req: CurrentUserRequest) {
		return this.authService.logout(req.user.id);
	}

	@Post('refresh-token') // un utilisateur doit pouvoir rafraîchir son token
	refreshToken(@Body('refreshToken') refreshToken: string) {
		return this.authService.refreshToken(refreshToken);
	}
}
