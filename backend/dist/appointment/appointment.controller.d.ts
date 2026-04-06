import { AppointmentsService } from './appointment.service';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { User } from 'src/user/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    private readonly cloudinaryService;
    constructor(appointmentsService: AppointmentsService, cloudinaryService: CloudinaryService);
    create(user: User, dto: CreateAppointmentDto, file: Express.Multer.File): Promise<import("./entities/appointment.entity").Appointment>;
    findMyAppointments(user: User): Promise<import("./entities/appointment.entity").Appointment[]>;
    findAllAppointments(): Promise<import("./entities/appointment.entity").Appointment[]>;
    cancel(id: number, user: User): Promise<import("./entities/appointment.entity").Appointment>;
    remove(id: number): Promise<import("./entities/appointment.entity").Appointment>;
}
