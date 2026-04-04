import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { UserRole } from 'src/user/enums/user-role.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    user: User, 
    dto: CreateAppointmentDto,
    paymentImageData?: { url: string | null; publicId: string | null }
  ): Promise<Appointment> {
    const { date, time, phoneNumber, productId } = dto;

    // 1. Validación de horario comercial
    const hour = Number(time.split(':')[0]);
    if (hour < 9 || hour > 21) {
      throw new BadRequestException('La hora debe estar entre 9:00 y 21:00');
    }

    // 2. Validación de existencia del producto/servicio
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('El producto no existe');
    }

    // 3. Validación de disponibilidad (máximo 5 citas por hora)
    const appointmentsCount = await this.appointmentRepository.count({
      where: {
        date: new Date(date),
        time,
        status: 'active',
      },
    });

    if (appointmentsCount >= 5) {
      throw new BadRequestException('Este horario ya alcanzó el límite de turnos');
    }

    const appointmentData = {
      date: new Date(date),
      time,
      phoneNumber,
      paymentImageUrl: paymentImageData?.url || null,
      paymentPublicId: paymentImageData?.publicId || null,
      status: 'active' as const,
      user,    
      product,
    };

    const appointment = this.appointmentRepository.create(appointmentData);
    return await this.appointmentRepository.save(appointment);
  }

  async findByUser(userId: number): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { user: { id: userId } },
      order: { date: 'ASC' },
    });
  }

  async cancelAppointment(
    appointmentId: number,
    user: User,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['user'],
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Seguridad: Solo el dueño o el admin pueden cancelar
    if (user.role !== UserRole.ADMIN && appointment.user.id !== user.id) {
      throw new ForbiddenException('No puedes cancelar esta cita');
    }

    appointment.status = 'cancelled';
    return this.appointmentRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['user', 'product'],
      order: { date: 'ASC' },
    });
  }
}
