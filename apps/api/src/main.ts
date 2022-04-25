import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('EntryPoint');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const PORT = process.env.NEST_API_PORT || 5000;
  await app.listen(PORT);
  logger.log(`Server running on port ${PORT}`);
}
bootstrap();
