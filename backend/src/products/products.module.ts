import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity'; 
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { CategoryModule } from 'src/categories/categories.module';
import { CloudinaryModule } from 'src/config/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),
  AuthModule,
  CategoryModule,
  CloudinaryModule
  ],
  controllers: [ProductController],
  providers: [ProductService],  
})
export class ProductsModule {}
