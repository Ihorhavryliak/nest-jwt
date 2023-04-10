import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserDto } from 'src/users/dto/users.dto';
import { DecodedJwtType } from './guard/roles.guard';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async singUp(user: UserDto, response: FastifyReply) {
    try {
      //check  is user and get sub id and email
      const dataUser = await this.usersService.create(user);
      //create token
      const accessToken = {
        access_token: this.jwtService.sign(dataUser, {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRE,
        }),
      };
      //set cookie with refresh token
      const maxAge = +process.env.JWT_REFRESH_ACCESS_EXPIRE;
      response.setCookie(
        'jwt',
        this.jwtService.sign(dataUser, {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_ACCESS_EXPIRE,
        }),
        {
          httpOnly: true,
          // secure: true,
          // sameSite: 'strict',
          maxAge,
        },
      );
      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  async login(user: UserDto, response: FastifyReply) {
    const dataUser = await this.usersService.login(user);
    //create token
    const accessToken = {
      access_token: this.jwtService.sign(dataUser, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
      }),
    };
    //set cookie with refresh token
    const maxAge = +process.env.JWT_REFRESH_ACCESS_EXPIRE;
    response.setCookie(
      'jwt',
      this.jwtService.sign(dataUser, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_ACCESS_EXPIRE,
      }),
      {
        httpOnly: true,
        // secure: true,
        // sameSite: 'strict',
        maxAge,
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
      throw error;
    }
  }

  async refreshToken(request: FastifyRequest) {
    try {
      //get token from cookie
      const tokenCookie = request.cookies['jwt'];
      if (!tokenCookie) {
        throw new ForbiddenException();
      }
      // Decode the token (without verification)
      const decoded = this.jwtService.decode(tokenCookie) as DecodedJwtType;
      // Check if the token has expired
      const isExpired = decoded.exp && Date.now() >= decoded.exp * 1000;
      if (isExpired) {
        throw new ForbiddenException({
          success: false,
          message: 'Token is expired',
        });
      }
      //decode
      const userDataDecode: { email: string } = await this.jwtService.verify(
        tokenCookie,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );
      if (!userDataDecode) {
        throw new ForbiddenException();
      }
      //get user
      const dataUser = await this.usersService.refresh(userDataDecode.email);
      //create token
      const accessToken = {
        access_token: this.jwtService.sign(dataUser, {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRE,
        }),
      };
      return accessToken;
    } catch (error) {
      throw error;
    }
  }
}
