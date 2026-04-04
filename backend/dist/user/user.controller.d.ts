import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<User>;
    updateUserRole(id: number, dto: UpdateRoleDto, admin: User): Promise<User>;
    getMe(req: any): Promise<any>;
    validateToken(req: any): Promise<{
        valid: boolean;
        user: any;
    }>;
    getUser(id: string): Promise<User>;
    findAllUsers(): Promise<Partial<User>[]>;
}
