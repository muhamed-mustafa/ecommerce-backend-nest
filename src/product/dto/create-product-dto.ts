import { IsString, IsNumber, IsNotEmpty, Min, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Price must be a positive number' })
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Stock must be a positive number' })
  stock: number;
}
