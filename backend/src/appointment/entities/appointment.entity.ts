import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  date!: Date;

  @Column()
  time!: string;

  @Column({ default: 'active' })
  status!: 'active' | 'cancelled' | 'completed' | 'pending';

  @Column()
  phoneNumber!: string;

  @Column({ type: 'varchar', nullable: true })
  paymentImageUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  paymentPublicId!: string | null;

  // 👉 Usuario autenticado (desde JWT)
  @ManyToOne(() => User, (user) => user.appointments, {
    eager: true,
    nullable: false,
  })
  user!: User;

  // 👉 Producto reservado
  @ManyToOne(() => Product, (product) => product.appointments, {
    eager: true,
    nullable: false,
  })
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date;
}