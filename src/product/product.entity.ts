import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

const CURRENT_TIMESTAMP = () => 'CURRENT_TIMESTAMP(6)';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @CreateDateColumn({ type: 'timestamp', default: CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: CURRENT_TIMESTAMP, onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;
}