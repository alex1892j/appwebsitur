import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    login(username: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: number;
            username: string;
            email: string;
            age: number;
            role: import("../user/enums/user-role.enum").UserRole;
            appointments: import("../appointment/entities/appointment.entity").Appointment[];
        };
    }>;
    validateUser(payload: any): Promise<{
        id: any;
        username: any;
    }>;
}
