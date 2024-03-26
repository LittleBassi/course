import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { matchText } from './utils/utils.constants';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.enableCors({
    origin: (origin, callback) => {
      const whitelist = configService.get<string>('WHITELIST')?.split('|');

      if (origin && matchText(origin, whitelist)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Course')
    .setDescription('Por Osmar André Bassi.')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira seu token JWT',
        in: 'header',
      },
      'JWT'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Course',
    swaggerOptions: {
      docExpansion: 'none',
      tagsSorter: 'alpha',
    },
  };

  SwaggerModule.setup('api', app, document, customOptions);

  await app.listen(configService.get<number>('APP_PORT'), () => {
    console.log('================================');
    console.log(`Port: ${configService.get<number>('APP_PORT') ?? '-'}`);
    console.log(`Environment: ${configService.get<string>('NODE_ENV') ?? '-'}`);
    console.log(`Database: ${configService.get<string>('DB_NAME') ?? '-'}`);
    console.log('================================');
  });
}
bootstrap().catch((error) => console.error('Erro', { error }));
