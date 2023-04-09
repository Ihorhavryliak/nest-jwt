import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async singUp(user: any, response: FastifyReply) {
    const payload = { username: user.username, sub: user.userId };
    const accessToken = {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
      }),
    };
    response.setCookie(
      'jwt',
      this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
      }),
      {
        httpOnly: true,
        /* secure: true, */
        /* sameSite: 'strict', */ //test
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    return accessToken;
  }

  async login(user: any, response: FastifyReply) {
    const payload = { username: user.username, sub: user.userId };
    const accessToken = {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
      }),
    };
    response.setCookie(
      'jwt',
      this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
      }),
      {
        httpOnly: true,
        /* secure: true, */
        /* sameSite: 'strict', */ //test
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    return accessToken;
  }

  async logout(request: FastifyRequest, response: FastifyReply) {
    try {
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
      throw new UnauthorizedException({ error });
    }
  }

  async refreshToken(request: FastifyRequest) {
    try {
      const tokenCookie = request.cookies['jwt'];
      if (!tokenCookie) {
        throw new ForbiddenException();
      }
      const userData: { name: string } = this.jwtService.verify(tokenCookie, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      if (!userData) {
        throw new ForbiddenException();
      }
      const payload = { username: userData.name };
      const accessToken = {
        access_token: this.jwtService.sign(payload, {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRE,
        }),
      };
      return accessToken;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException({ error });
    }
  }
}
