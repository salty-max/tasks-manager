import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import config = require('config');

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const { port: configPort, origin } = config.get('server');

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin });
    logger.log(`Acceptong requests from origin ${origin}`);
  }

  const port = process.env.PORT || configPort;

  await app.listen(port);
  logger.log(`Listening on port ${port}`);
}
bootstrap();
