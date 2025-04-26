import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product-dto';
import { NotFoundException } from '@nestjs/common';

type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};
type Options = { where: { name: string; minPrice: number; maxPrice: number } };
type FindOneParam = { where: { id: number } };

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<Product>;
  const REPOSITORY_TOKEN = getRepositoryToken(Product);

  const createProductDto: CreateProductDto = {
    name: 'Laptop',
    description: 'Laptop description',
    price: 1000,
    stock: 10,
  };

  let products: ProductType[];

  beforeEach(async () => {
    products = [
      {
        id: 1,
        name: 'Laptop',
        description: 'Laptop description',
        price: 1000,
        stock: 10,
      },
      {
        id: 2,
        name: 'Phone',
        description: 'Phone description',
        price: 500,
        stock: 5,
      },
    ];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn((dto: CreateProductDto) => dto),
            save: jest.fn((dto: CreateProductDto) =>
              Promise.resolve({ id: 1, ...dto }),
            ),
            find: jest.fn((options: Options) => {
              if (options.where.name)
                return Promise.resolve(
                  products.filter((product) => product.name === 'Laptop'),
                );
              if (options.where.minPrice && options.where.maxPrice)
                return Promise.resolve(
                  products.filter(
                    (product) =>
                      product.price >= options.where.minPrice &&
                      product.price <= options.where.maxPrice,
                  ),
                );
              if (options.where.minPrice)
                return Promise.resolve(
                  products.filter(
                    (product) => product.price >= options.where.minPrice,
                  ),
                );
              if (options.where.maxPrice)
                return Promise.resolve(
                  products.filter(
                    (product) => product.price <= options.where.maxPrice,
                  ),
                );
              return Promise.resolve(products);
            }),

            findOne: jest.fn((param: FindOneParam) =>
              Promise.resolve(
                products.find((product) => product.id === param.where.id),
              ),
            ),
            remove: jest.fn((product: Product) => {
              return Promise.resolve(
                products.filter((p) => p.id !== product.id),
              );
            }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            currentUser: jest.fn((id: number) => Promise.resolve({ id })),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should productRepository be defined', () => {
    expect(productRepository).toBeDefined();
  });

  describe('create Product', () => {
    it('create product', async () => {
      await service.create(createProductDto, 1);
      expect(productRepository.create).toHaveBeenCalled();
      expect(productRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should create a new product', async () => {
      const product = await service.create(createProductDto, 1);
      expect(product).toBeDefined();
      expect(product.name).toEqual(createProductDto.name);
      expect(product.description).toEqual(createProductDto.description);
      expect(product.price).toEqual(createProductDto.price);
      expect(product.stock).toEqual(createProductDto.stock);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await service.findAll();
      expect(result).toEqual(products);
      expect(productRepository.find).toHaveBeenCalled();
      expect(productRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an array of products filtered by name', async () => {
      const result = await service.findAll('Laptop');
      expect(result).toHaveLength(1);
      expect(productRepository.find).toHaveBeenCalled();
      expect(productRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an array of products if no filters are applied', async () => {
      const results = await service.findAll();
      expect(results).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const result = await service.findOne(1);
      expect(result).toMatchObject(products[0]);
      expect(result).toHaveProperty('id', 1);
    });

    it('should throw an error if product is not found', async () => {
      try {
        await service.findOne(3);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toMatchObject({ message: 'Product not found' });
        expect(error.message).toBe('Product not found');
      }
    });
  });

  describe('update product', () => {
    it('should update a product', async () => {
      const result = await service.update(1, { name: 'Laptop updated' });
      expect(productRepository.save).toHaveBeenCalled();
      expect(result).toMatchObject({ name: 'Laptop updated' });
      expect(result.name).toBe('Laptop updated');
    });

    it('should throw an error if product is not found', async () => {
      try {
        await service.update(3, { name: 'Laptop updated' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toMatchObject({ message: 'Product not found' });
        expect(error.message).toBe('Product not found');
      }
    });
  });

  describe('delete product', () => {
    it('should delete a product', async () => {
      const result = await service.remove(1);
      expect(productRepository.remove).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should throw an error if product is not found', async () => {
      try {
        await service.remove(3);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toMatchObject({ message: 'Product not found' });
      }
    });
  });
});
