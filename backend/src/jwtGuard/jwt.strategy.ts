// src/jwtGuard/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'CLAVE_TEMPORAL_DE_SEGURIDAD',
    });
  }

  async validate(payload: any) {
  
    if (!payload.sub) {
       console.error('Error: El token no tiene la propiedad "sub" (ID del usuario)');
       throw new UnauthorizedException('Token mal formado');
    }

    const user = await this.userService.findById(payload.sub);

    if (!user) {    
      throw new UnauthorizedException('El usuario del token ya no existe');
    }
    return user; 
  }
}
