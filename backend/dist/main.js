"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: '*',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    await app.listen(3000);
    const serverUrl = await app.getUrl();
    common_1.Logger.log(`🚀 Servidor corriendo en: ${serverUrl}`);
    const httpAdapter = app.getHttpAdapter();
    if (httpAdapter && 'getInstance' in httpAdapter) {
        const instance = httpAdapter.getInstance();
        if (instance && instance._router) {
            const routes = instance._router.stack
                .filter((r) => r.route)
                .map((r) => `${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
            common_1.Logger.log('📌 Rutas registradas:', routes);
        }
        else {
            common_1.Logger.warn('⚠ No se pudieron listar las rutas.');
        }
    }
}
bootstrap();
//# sourceMappingURL=main.js.map