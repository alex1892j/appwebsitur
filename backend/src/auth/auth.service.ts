// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
  
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const { password: _, ...safeUser } = user;

    return { accessToken, user: safeUser };
  }
  
  async validateUser(payload: any) {
    return { id: payload.sub, username: payload.username };
  }
}
