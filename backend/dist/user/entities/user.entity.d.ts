import { Appointment } from '../../appointment/entities/appointment.entity';
import { UserRole } from '../enums/user-role.enum';
export declare class User {
    id: number;
    username: string;
    password: string;
    email: string;
    age: number;
    role: UserRole;
    appointments: Appointment[];
}
