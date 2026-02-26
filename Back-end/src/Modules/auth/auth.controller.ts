import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service'

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
}
