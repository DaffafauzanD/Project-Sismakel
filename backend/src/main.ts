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

  // Add cookie parser middleware
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // ✅ Swagger Setup with Authentication
  const config = new DocumentBuilder()
    .setTitle('Sismakel API Documentation')
    .setDescription('API documentation for Sismakel application with JWT Authentication')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for references
    )
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Products', 'Product management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = environment.port;
  await app.listen(port);
  console.log(`🚀 App running at: http://localhost:${port}`);
  console.log(`📚 Docs: http://localhost:${port}/docs`);
}
bootstrap();
