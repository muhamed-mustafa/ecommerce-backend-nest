import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductDto } from './create-product-dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    example: 'Updated Product Name',
    description: 'Optional product name',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated Description',
    description: 'Optional product description',
  })
  description?: string;

  @ApiPropertyOptional({ example: 25, description: 'Optional product price' })
  price?: number;

  @ApiPropertyOptional({ example: 5, description: 'Optional stock count' })
  stock?: number;
}
