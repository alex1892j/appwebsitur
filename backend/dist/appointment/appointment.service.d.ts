import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
export declare class AppointmentsService {
    private readonly appointmentRepository;
    private readonly productRepository;
    constructor(appointmentRepository: Repository<Appointment>, productRepository: Repository<Product>);
    create(user: User, dto: CreateAppointmentDto, paymentImageData?: {
        url: string | null;
        publicId: string | null;
    }): Promise<Appointment>;
    findByUser(userId: number): Promise<Appointment[]>;
    cancelAppointment(appointmentId: number, user: User): Promise<Appointment>;
    findAll(): Promise<Appointment[]>;
}
