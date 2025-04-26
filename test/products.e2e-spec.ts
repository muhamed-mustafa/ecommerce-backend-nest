import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Product } from '../src/product/product.entity';
import { CreateProductDto } from 'src/product/dto/create-product-dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../src/user/user.entity';
import { UserType } from '../src/utils/enums';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let productsToSave: CreateProductDto[] = [];
  let accessToken: string;

  beforeEach(async () => {
    productsToSave = [
      { name: 'Product 1', price: 10, description: 'Description 1', stock: 10 },
      { name: 'Product 2', price: 20, description: 'Description 2', stock: 20 },
      { name: 'Product 3', price: 30, description: 'Description 3', stock: 30 },
      { name: 'Product 4', price: 40, description: 'Description 4', stock: 40 },
    ];
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get<DataSource>(DataSource);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          username: 'admin',
          email: 'admin@gmail.com',
          password: hashedPassword,
          userType: UserType.ADMIN,
        },
      ])
      .execute();

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@gmail.com',
        password: 'password',
      })
      .expect(200);

    console.log('auth response', response.body?.token);
    accessToken = response.body.token;
  });

  afterEach(async () => {
    await dataSource.createQueryBuilder().delete().from(Product).execute();
    await dataSource.createQueryBuilder().delete().from(User).execute();
    await app.close();
  });

  describe('create product', () => {
    beforeEach(async () => {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(productsToSave)
        .execute();
    });
    it('should create a product', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Laptop',
          description: 'A powerful and sleek high-end laptop',
          price: 1299.99,
          stock: 25,
        });

      expect(response.status).toBe(201);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Laptop',
          description: 'A powerful and sleek high-end laptop',
          price: 1299.99,
          stock: 25,
        });
      expect(response.status).toBe(401);
    });

    it('should return error status 400 if name is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description: 'A powerful and sleek high-end laptop',
          price: 1299.99,
          stock: 25,
        });
      expect(response.status).toBe(400);
    })
    it('should find all products', async () => {
      await request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(4);
        });
    });
  });
});
