import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config = require('config');

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const serverConfig: any = config.get('server');

  const port = process.env.PORT || serverConfig.port;

  await app.listen(port);
  logger.log(`Listening on port ${port}`);
}
bootstrap();
