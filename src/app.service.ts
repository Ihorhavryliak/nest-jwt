import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as util from 'util';
import * as fs from 'fs';
import stream = require('stream');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
