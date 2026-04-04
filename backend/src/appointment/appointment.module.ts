import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsController } from './appointment.controller';
import { AppointmentsService } from './appointment.service';
import { Product } from 'src/products/entities/product.entity';
import { CloudinaryModule } from 'src/config/cloudinary.module';


@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Product]),
  CloudinaryModule 
 ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
