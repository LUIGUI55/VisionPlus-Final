import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'mi_super_secreto_123_cambiar_en_produccion',
        });
    }

    async validate(payload: any) {
        // el payload viene del token JWT
        // payload = { sub: userId, email: userEmail }
        return await this.authService.validateUserById(payload.sub);
    }
}
