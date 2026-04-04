import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from 'src/categories/categories.service';
export declare class ProductService {
    private readonly productRepository;
    private readonly categoryService;
    constructor(productRepository: Repository<Product>, categoryService: CategoryService);
    findAll(categoryId?: number): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    create(dto: CreateProductDto): Promise<Product>;
    update(id: number, dto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
}
