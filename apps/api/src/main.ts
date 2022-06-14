import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const logger = new Logger('EntryPoint');
  const app = await NestFactory.create(AppModule);

  const prisma = app.get(PrismaService);
  app.use(
    session({
      secret: 'super-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
      },
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // const config = new DocumentBuilder()
  //   .setTitle('Pocket API')
  //   .setDescription('The Pocket API description')
  //   .setVersion('1.0.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  const PORT = process.env.NEST_API_PORT || 5000;
  await app.listen(PORT);
  logger.log(`Server running on port ${PORT}`);
}
bootstrap();
