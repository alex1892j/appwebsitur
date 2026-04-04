import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  // ✅ Obtener todas las categorías activas
  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { isActive: true },
      relations: ['products'],
      order: { name: 'ASC' },
    });
  }

  // ✅ Obtener una categoría por ID
  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  // ✅ Crear categoría
  async create(data: Partial<Category>): Promise<Category> {
    if (!data.name) {
      throw new BadRequestException('El nombre de la categoría es obligatorio');
    }
    const existing = await this.categoryRepo.findOne({ where: { name: data.name } });
    if (existing) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  // ✅ Actualizar categoría
  async update(id: number, data: Partial<Category>): Promise<Category> {
    const category = await this.findById(id);
    Object.assign(category, data);
    return this.categoryRepo.save(category);
  }

  // ✅ Borrado lógico
 async remove(id: number): Promise<void> {
  const category = await this.categoryRepo.findOne({
    where: { id },
    relations: ['products'],
  });

  if (!category) {
    throw new NotFoundException('Categoría no encontrada');
  }

  if (category.products.length > 0) {
    throw new BadRequestException(
      'No se puede eliminar la categoría porque tiene productos asociados',
    );
  }

  await this.categoryRepo.remove(category);
  }
}