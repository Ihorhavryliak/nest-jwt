import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async singUp(user: any, response: FastifyReply) {
    const payload = { username: user.username, sub: user.userId };
    response.setCookie(
      'jwt',
      this.jwtService.sign(payload, { expiresIn: '3m' }),
      {
        httpOnly: true,
        /* secure: true, */
        /* sameSite: 'strict', */ //test
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(user: any, response: FastifyReply) {
    const payload = { username: user.username, sub: user.userId };
    response.setCookie(
      'jwt',
      this.jwtService.sign(payload, { expiresIn: '3m' }),
      {
        httpOnly: true,
        /* secure: true, */
        /* sameSite: 'strict', */ //test
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(request: FastifyRequest, response: FastifyReply) {
    try {
      console.log('ddd', request.cookies);
      const token = request.cookies['jwt'];
      if (!token) {
        throw new UnauthorizedException({ message: 'jwt not found' });
      }
      response.clearCookie('jwt', {
        httpOnly: true,
        /* secure: true, */
        /* sameSite: 'strict', */ //test
      });
      const message = { message: 'Cookie cleared' };
      return message;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async refreshToken(token: string | undefined) {
    try {
      if (!token) {
        throw new ForbiddenException();
      }
      const userData: { name: string } = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      if (!userData) {
        throw new ForbiddenException();
      }
      const payload = { username: userData.name };
      return {
        access_token: this.jwtService.sign(payload, { expiresIn: '1m' }),
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
