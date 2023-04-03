import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AppResponseDto } from './appDto/app-response.dto ';
import * as util from 'util';
import * as fs from 'fs';
import stream = require('stream');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // upload file
  async uploadFile(req: FastifyRequest, res: FastifyReply<any>): Promise<any> {
    // upload file
    try {
      //Check request is multipart
      if (!req.isMultipart()) {
        res.send(
          new BadRequestException(
            new AppResponseDto(400, undefined, 'Request is not multipart'),
          ),
        );
        return;
      }
      //
      const options = {
        limits: {
          fieldSize: 1, // Max field value size in bytes
        },
      };
      const mp = await req.multipart(handler, onEnd, options);
      // for key value pairs in request
      mp.on('file', function (key: any, value: any) {
        // console.log('form-data', key, value,'<');
      });
      //Save files in directory
      async function handler(
        field: string,
        file: any,
        filename: string,
        encoding: string,
        mimetype: string,
      ): Promise<void> {
        const pipeline = util.promisify(stream.pipeline);
        const writeStream = fs.createWriteStream(`uploads/${filename}`); //File path
        try {
          await pipeline(file, writeStream);
        } catch (err) {
          console.error('Pipeline failed', err);
        }
      }
      // Uploading finished
      async function onEnd(err: any) {
        if (err) {
          res.send(new HttpException('Internal server error', 500));
          return;
        }
        res
          .code(200)
          .send(
            new AppResponseDto(200, undefined, 'Data uploaded successfully'),
          );
      }
    } catch (err) {
      console.log(err);
    }
  }
}
