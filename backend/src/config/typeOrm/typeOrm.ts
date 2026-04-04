// src/config/database.config.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Product } from 'src/products/entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';

// Cargar variables de entorno
dotenv.config({ path: './.env.development.local' });

const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'dragon1',
  database: process.env.DB_NAME || 'spa_citas',
  synchronize: true,
  //dropSchema: true,
  logging: isDevelopment,      
  autoLoadEntities: true,
  entities: [User, Appointment, Product, Category],
  subscribers: [],
  extra: {
  },
};

export default registerAs('typeorm', () => config);

export const connectSource = new DataSource(config as DataSourceOptions);

