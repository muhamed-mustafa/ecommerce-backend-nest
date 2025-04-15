import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JWTPayloadType } from 'src/utils/types';

declare module 'express' {
  export interface Request {
    user?: JWTPayloadType;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();

    const token = request.headers?.authorization?.split(' ')[1];

    if (!token)
      throw new UnauthorizedException('Access denied! No token provided!');

    const payload: JWTPayloadType = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    request.user = payload;

    return true;
  }
}
