import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { environment } from './config/environment.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: environment.cors.origin,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // ✅ Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Sismakel API Documentation')
    .setDescription('API documentation for Sismakel application')
    .setVersion('1.0')
    .addBearerAuth() // ✅ kalau pakai token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // ⬅️ Dokumentasi di /docs

  const port = environment.port;
  await app.listen(port);
  console.log(`🚀 App running at: http://localhost:${port}`);
  console.log(`📚 Docs: http://localhost:${port}/docs`);
}
bootstrap();
