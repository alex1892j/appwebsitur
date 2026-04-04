import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { JwtAuthGuard } from 'src/jwtGuard/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Patch, Param, ParseIntPipe } from '@nestjs/common';
import { RolesGuard } from 'src/jwtGuard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user-role.enum';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  // Crear cita
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @CurrentUser() user: User, 
    @Body() dto: CreateAppointmentDto,
    @UploadedFile() file: Express.Multer.File, // 👈 Recibimos el archivo
  ){
    let paymentImageData = { url: null, publicId: null };

    // Si el usuario eligió Yape/Plin y subió un archivo, lo procesamos como PRIVADO
    if (file && (dto.paymentMethod === 'yape' || dto.paymentMethod === 'plin')) {
      const uploadResult = await this.cloudinaryService.uploadPaymentCapture(file);
      paymentImageData.url = uploadResult.secure_url;
      paymentImageData.publicId = uploadResult.public_id;
    }

    // Pasamos el usuario, el DTO y los datos de la imagen al servicio
    return this.appointmentsService.create(user, dto, paymentImageData);
  }

  // Obtener citas del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('my-appointments')
  findMyAppointments(@CurrentUser() user: User) {
    return this.appointmentsService.findByUser(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAllAppointments() {
    return this.appointmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.appointmentsService.cancelAppointment(id, user);
  }
}
