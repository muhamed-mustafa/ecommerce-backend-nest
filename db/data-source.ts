import { Product } from 'src/product/product.entity';
import { Review } from 'src/review/review.entity';
import { User } from 'src/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Product, User, Review],
  migrations: ['dist/db/migrations/*.js'],
};


export const dataSource = new DataSource(dataSourceOptions);