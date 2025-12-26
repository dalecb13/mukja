import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { MetricsService } from './metrics/metrics.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for web clients and native apps
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  app.enableCors({
    origin: isDevelopment
      ? true // Allow all origins in development (for native apps and web)
      : [
          // Production: restrict to specific origins
          'http://localhost:8081',  // Expo web dev server
          'http://localhost:19006', // Expo web alternate port
          'http://localhost:3000',  // Next.js web app
          'http://localhost:3001',  // Alternative dev port
        ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter for error logging
  const metricsService = app.get(MetricsService);
  app.useGlobalFilters(new HttpExceptionFilter(metricsService));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Native API')
    .setDescription('The Native API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
  
  try {
    await app.listen(port);
    const url = `http://localhost:${port}`;
    console.log('Application is running on:', url);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Swagger documentation:', `${url}/api`);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Bootstrap error:', error);
  process.exit(1);
});

