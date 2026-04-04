import { CategoryService } from './categories.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(): Promise<import("./entities/category.entity").Category[]>;
    create(body: {
        name: string;
        description?: string;
    }): Promise<import("./entities/category.entity").Category>;
    update(id: number, body: any): Promise<import("./entities/category.entity").Category>;
    remove(id: number): Promise<void>;
}
