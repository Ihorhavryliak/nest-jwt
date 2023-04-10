import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from '../enum/role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    //get token
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.jwt;
    if (!token) {
      throw new UnauthorizedException({
        success: false,
        message: 'Credentials incorrect',
      });
    }
    const decoded = this.jwtService.decode(token) as DecodedJwtType;
    return requiredRoles.some((role) => decoded.roles?.includes(role));
  }
}

export type DecodedJwtType = {
  sub: number;
  email: string;
  roles: string[];
  exp: number;
};
