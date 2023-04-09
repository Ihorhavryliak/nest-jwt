import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserDto } from 'src/users/dto/users.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async singUp(
    @Body() dto: UserDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return this.authService.singUp(dto, response);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: UserDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return this.authService.login(dto, response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return this.authService.logout(request, response);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('refresh-token')
  async refreshToken(@Req() request: FastifyRequest) {
    return this.authService.refreshToken(request);
  }

  @Get('file')
  async file(@Req() request: FastifyRequest) {
    return { file: 'file' };
  }
}
