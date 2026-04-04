import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtPayloadGuard extends AuthGuard('jwt-payload') {}