import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiProductFilters() {
  return applyDecorators(
    ApiQuery({
      name: 'name',
      required: false,
      type: String,
      description: 'Product name filter query',
    }),
    ApiQuery({
      name: 'minPrice',
      required: false,
      type: String,
      description: 'Minimum price filter query',
    }),
    ApiQuery({
      name: 'maxPrice',
      required: false,
      type: String,
      description: 'Maximum price filter query',
    }),
  );
}
