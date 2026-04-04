import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  time!: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @Type(() => Number)
  @IsNumber()
  productId!: number;
}