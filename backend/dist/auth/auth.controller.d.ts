import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginUserDto): Promise<{
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
}
