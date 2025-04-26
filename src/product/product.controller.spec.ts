import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserType } from '../utils/enums';
import { CreateProductDto } from './dto/create-product-dto';
type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};

let products: ProductType[];

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;
  const currentUser = { id: 1, userType: UserType.ADMIN };
  const createProductDto: CreateProductDto = {
    name: 'Product 1',
    price: 10,
    description: 'Description 1',
    stock: 10,
  };
  beforeEach(async () => {
    products = [
      {
        id: 1,
        name: 'Laptop',
        description: 'Laptop description',
        price: 3000,
        stock: 10,
      },
      {
        id: 2,
        name: 'Phone',
        description: 'Phone description',
        price: 500,
        stock: 5,
      },

      {
        id: 3,
        name: 'Tablet',
        description: 'Tablet description',
        price: 800,
        stock: 8,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn().mockResolvedValue(createProductDto),
            findAll: jest.fn(
              (title?: string, minPrice?: string, maxPrice?: string) => {
                if (title)
                  return Promise.resolve(
                    products.filter((product) => product.name === title),
                  );
                if (minPrice && maxPrice)
                  return Promise.resolve(
                    products.filter(
                      (product) =>
                        product.price >= parseInt(minPrice) &&
                        product.price <= parseInt(maxPrice),
                    ),
                  );
                return Promise.resolve(products);
              },
            ),
            findOne: jest.fn().mockResolvedValue(products[0]),
            update: jest.fn((id, updateProductDto) => {
              return Promise.resolve({ ...updateProductDto, id });
            }),
            remove: jest.fn().mockResolvedValue(true),
          },
        },
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: MailService, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('create product', () => {
    it('should create a product', async () => {
      await productService.create(createProductDto, currentUser.id);
      expect(productService.create).toHaveBeenCalledWith(
        createProductDto,
        currentUser.id,
      );
    });
  });

  describe('find products', () => {
    it('should find products', async () => {
      await controller.findAll();
      expect(productService.findAll).toHaveBeenCalled();
      expect(productService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should find products by title', async () => {
      const data = await controller.findAll('Laptop');
      expect(data[0]).toMatchObject({ name: 'Laptop' });
      expect(productService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should find products by min price and max price', async () => {
      const data = await controller.findAll(undefined, '500', '800');
      expect(data).toHaveLength(2);
    });
  });

  describe('find one product', () => {
    it('should find one product', async () => {
      const data = await controller.findOne(1);
      expect(data).toMatchObject({ id: 1 });
      expect(productService.findOne).toHaveBeenCalled();
      expect(productService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update product', () => {
    it('should update a product', async () => {
      const data = await controller.update(1, { name: 'IPHONE 16' });
      expect(data).toMatchObject({ id: 1 });
      expect(productService.update).toHaveBeenCalled();
      expect(productService.update).toHaveBeenCalledTimes(1);
      expect(data.name).toBe('IPHONE 16');
    });
  });

  describe('remove product', () => {
    it('should remove a product', async () => {
      const data = await controller.remove(1);
      expect(productService.remove).toHaveBeenCalled();
      expect(productService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
