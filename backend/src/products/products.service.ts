import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from 'src/categories/categories.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  /* =========================
     Obtener productos
  ========================= */
  async findAll(categoryId?: number): Promise<Product[]> {
    if (categoryId) {
      return this.productRepository.find({
        where: { category: { id: categoryId } },
      });
    }
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  /* =========================
     Crear producto
  ========================= */
  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryService.findById(dto.categoryId);

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const product = this.productRepository.create({
      nombre: dto.nombre,
      precio: dto.precio,
      description: dto.description,
      imageUrl: dto.imageUrl,
      category,
    });

    return this.productRepository.save(product);
  }

  /* =========================
     Actualizar producto
  ========================= */
  async update(
    id: number,
    dto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.categoryService.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
      product.category = category;
    }

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  /* =========================
     Eliminar producto
  ========================= */
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
