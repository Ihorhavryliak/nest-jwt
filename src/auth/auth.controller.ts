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

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async singUp(
    @Body() dto: any,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return this.authService.singUp(dto, response);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: any,
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
    const token = request.cookies['jwt'];
    return this.authService.refreshToken(token);
  }
}
