import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JWTPayloadType } from 'src/utils/jwt.type';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { UserType } from 'src/utils/enums';

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
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserType[] = this.reflector.get('roles', context.getHandler());

    if (!roles) return true;

    const request: Request = context.switchToHttp().getRequest<Request>();

    const token = request.headers?.authorization?.split(' ')[1];

    if (!token)
      throw new UnauthorizedException('Access denied! No token provided!');

    const payload: JWTPayloadType = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const user = await this.userService.findOneById(payload.id);

    if (!roles.includes(user.userType))
      throw new UnauthorizedException(
        'Access denied! You do not have permission to access this resource!',
      );

    request.user = payload;

    return true;
  }
}
