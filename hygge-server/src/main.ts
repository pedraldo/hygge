import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:4200', 'http://192.168.1.46:4200'],
    allowedHeaders: ['content-type'],
    // origin: 'http://localhost:4200',
  });
  app.use(cookieParser());

  // Check here - Swagger setup
  const config = new DocumentBuilder()
    .setTitle('NestJs Auth Base API')
    .setDescription('THE Documentation')
    .setVersion('1.0')
    .addTag('waouw')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
