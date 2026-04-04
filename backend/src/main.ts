import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });

  

  app.useGlobalPipes(new ValidationPipe(
    {
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true, 
    },
    }
  ));

  await app.listen(3000);

  const serverUrl = await app.getUrl();
  Logger.log(`🚀 Servidor corriendo en: ${serverUrl}`);

  // ✅ Obtiene todas las rutas registradas en NestJS
  const httpAdapter = app.getHttpAdapter();
  if (httpAdapter && 'getInstance' in httpAdapter) {
    const instance = httpAdapter.getInstance();
    if (instance && instance._router) {
      const routes = instance._router.stack
        .filter((r) => r.route)
        .map((r) => `${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
      Logger.log('📌 Rutas registradas:', routes);
    } else {
      Logger.warn('⚠ No se pudieron listar las rutas.');
    }
  }
}

bootstrap();
