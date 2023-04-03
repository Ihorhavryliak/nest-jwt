import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fmp from '@fastify/multipart';
/* import {
  fmp
} from '@nest-lab/fastify-multer'; */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(3000, () => console.log('Server on port 3000'));
}
bootstrap();
