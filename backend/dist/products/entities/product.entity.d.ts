import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Category } from 'src/categories/entities/category.entity';
export declare class Product {
    id: number;
    nombre: string;
    precio: number;
    description: string;
    imageUrl: string;
    imagePublicId: string;
    appointments: Appointment[];
    category: Category;
}
