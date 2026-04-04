import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './enums/user-role.enum';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    updateRole(targetUserId: number, newRole: UserRole, requesterId: number): Promise<User>;
    findAll(): Promise<Partial<User>[]>;
    findById(id: number): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    validateUser(email: string, password: string): Promise<User | null>;
    remove(id: number): Promise<void>;
}
