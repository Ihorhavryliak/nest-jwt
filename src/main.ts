import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fmp from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(
    fmp /*  {
    limits: {
        fieldNameSize: 1, // Max field name size in bytes
        fieldSize: 1, // Max field value size in bytes
        fields: 10,         // Max number of non-file fields
        fileSize: 1,      // For multipart forms, the max file size
        files: 1,           // Max number of file fields
        headerPairs:12000,   // Max number of header key=>value pairs
    },
} */,
  );

  await app.listen(3000, () => console.log('Server on port 3000'));
}
bootstrap();
