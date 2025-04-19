import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from '../utils/constants';
import { Review } from 'src/review/review.entity';
import { User } from 'src/user/user.entity';

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

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE', eager: true })
  user: User;

  @OneToMany(() => Review, (review) => review.product, { cascade: true, eager: true })
  reviews: Review[];

  @CreateDateColumn({ type: 'timestamp', default: CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: CURRENT_TIMESTAMP,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
