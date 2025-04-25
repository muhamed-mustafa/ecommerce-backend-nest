import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Between,
  ILike,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly authService: AuthService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    const user = await this.authService.currentUser(userId);
    const product = this.productRepository.create({
      ...createProductDto,
      user,
    });
    return await this.productRepository.save(product);
  }

  async findAll(
    name?: string,
    minPrice?: string,
    maxPrice?: string,
  ): Promise<Product[]> {
    const filter: any = {
      ...(name && { name: ILike(`%${name}%`) }),
      ...((minPrice && maxPrice && { price: Between(minPrice, maxPrice) }) ||
        (minPrice && { price: MoreThanOrEqual(minPrice) }) ||
        (maxPrice && { price: LessThanOrEqual(maxPrice) })),
    };

    console.log('filter', filter);

    return await this.productRepository.find({ where: filter });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
