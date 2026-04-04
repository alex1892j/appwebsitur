import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeOrm/typeOrm';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './categories/categories.module';
import { AppointmentsModule } from './appointment/appointment.module';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig], 
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const ormConfig = configService.get('typeorm'); 
        if (!ormConfig) {
          throw new Error('❌ Error: No se encontró la configuración de TypeORM');
        }
        return ormConfig;
      },
    }),
    UserModule,
    AuthModule,
    ProductsModule,
    AppointmentsModule,
    CategoryModule,
  ],
  providers: [],
  
})
export class AppModule {}


