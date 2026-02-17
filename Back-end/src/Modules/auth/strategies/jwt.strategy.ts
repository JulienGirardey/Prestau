import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // extrait le token du Header "Authorization: Bearer TOKEN"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // Rejeter les tokens expirés
      ignoreExpiration: false,
      
      // Clé secrète pour vérifier la signature du token
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  // Appelé automatiquement après décodage du token
  async validate(payload: any) {
    // ex de données contenues dans le token: 
		// payload = { email: "...", sub: 5, role: "COMPANY" }
    
    // Vérifie que le user existe toujours dans la DB avce l'id du token (payload.sub)
    const user = await this.authService.validateUser(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // retourne l'utilisateur trouvé, qui sera ajouté à req.user dans les Guards
    return user;
  }
};
