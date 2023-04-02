import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload')
  async uploadFile(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply<any>,
  ): Promise<any> {
    return await this.appService.uploadFile(req, res);
  }
}
