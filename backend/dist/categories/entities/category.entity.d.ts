import { Product } from 'src/products/entities/product.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    products: Product[];
    createdAt: Date;
}
