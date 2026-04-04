import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, ...rest } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException(
        'El email o el nombre de usuario ya están en uso',
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      ...rest,
    });

    return await this.userRepository.save(user);
  }

  async updateRole(
  targetUserId: number,
  newRole: UserRole,
  requesterId: number,
): Promise<User> {
  if (targetUserId === requesterId) {
    throw new ForbiddenException('No puedes cambiar tu propio rol');
  }

  const user = await this.findById(targetUserId);

  if (user.role === newRole) {
    throw new ConflictException('El usuario ya tiene ese rol');
  }

  user.role = newRole;
  return this.userRepository.save(user);
}

 async findAll(): Promise<Partial<User>[]> {
  const users = await this.userRepository.find();

  return users.map(({ password, ...user }) => user);
}


  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    const { password, ...safeUser } = user;
    return safeUser as User;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
  }
}