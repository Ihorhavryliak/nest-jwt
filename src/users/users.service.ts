import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/users.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: UserDto): Promise<DataTokenType> {
    const isUser = await this.findUser(dto.email);
    if (isUser)
      throw new HttpException(
        { success: false, message: 'Conflict' },
        HttpStatus.CONFLICT,
      );

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user
      .create({
        data: {
          email: dto.email,
          password,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException({
              success: false,
              message: 'Credentials incorrect',
            });
          }
        }
        throw error;
      });

    return { sub: user.id, email: user.email, roles: user.roles };
  }
  async login(dto: UserDto): Promise<DataTokenType> {
    //find user
    const user = await this.findUser(dto.email);
    // check is user
    if (!user) {
      throw new HttpException(
        { success: false, message: 'Unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    //compare password
    const matchPassword = await bcrypt.compare(dto.password, user.password);
    if (!matchPassword) {
      throw new HttpException(
        { success: false, message: 'Unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { sub: user.id, email: user.email, roles: user.roles };
  }
  async refresh(email: string): Promise<DataTokenType> {
    //find user
    const user = await this.findUser(email);
    // check is user
    if (!user) {
      throw new HttpException(
        { success: false, message: 'Unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { sub: user.id, email: user.email, roles: user.roles };
  }

  async findUser(email: string): Promise<UserDto> {
    //find user
    const user = (await this.prisma.user.findUnique({
      where: {
        email,
      },
    })) as UserDto;
    //check
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

export type Token = {
  accessToken: string;
};

export type DataTokenType = { sub: number; email: string; roles: string[] };
