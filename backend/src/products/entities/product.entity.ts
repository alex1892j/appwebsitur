import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

   @Column({ nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  imagePublicId: string;
  
  @OneToMany(() => Appointment, (appointment) => appointment.product)
  appointments: Appointment[];

    @ManyToOne(() => Category, (category) => category.products, {
    eager: true,        
    nullable: false,    
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

