import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
export declare class Appointment {
    id: number;
    date: Date;
    time: string;
    status: 'active' | 'cancelled' | 'completed' | 'pending';
    phoneNumber: string;
    paymentImageUrl: string | null;
    paymentPublicId: string | null;
    user: User;
    product: Product;
    createdAt: Date;
}
