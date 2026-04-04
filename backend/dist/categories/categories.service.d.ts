import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
export declare class CategoryService {
    private readonly categoryRepo;
    private productRepo;
    constructor(categoryRepo: Repository<Category>, productRepo: Repository<Product>);
    findAll(): Promise<Category[]>;
    findById(id: number): Promise<Category>;
    create(data: Partial<Category>): Promise<Category>;
    update(id: number, data: Partial<Category>): Promise<Category>;
    remove(id: number): Promise<void>;
}
