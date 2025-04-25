import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @ApiProperty({
    example: 'Product 1',
    description: 'Product name',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 2,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  @ApiProperty({
    example: 'Product description',
    description: 'Product description',
    required: true,
    type: String,
    maxLength: 1000,
    minLength: 10,
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Price must be a positive number' })
  @ApiProperty({
    example: 10,
    description: 'Product price',
    required: true,
    type: Number,
    minimum: 0,
  })
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Stock must be a positive number' })
  @ApiProperty({
    example: 10,
    description: 'Product stock',
    required: true,
    type: Number,
    minimum: 0,
  })
  stock: number;
}
