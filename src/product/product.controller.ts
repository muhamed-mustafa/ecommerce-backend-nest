import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { UserType } from 'src/utils/enums';
import { Role } from 'src/user/decorators/user.role.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user-decorator';
import { JWTPayloadType } from 'src/utils/jwt.type';
import { AuthRoleGuard } from 'src/auth/guards/auth.guard.roles';

@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthRoleGuard)
  @Role(UserType.ADMIN)
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: JWTPayloadType,
  ) {
    return this.productService.create(createProductDto, user.id);
  }

  @Get()
  findAll(
    @Query('name') name: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    return this.productService.findAll(name, minPrice, maxPrice);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthRoleGuard)
  @Role(UserType.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthRoleGuard)
  @Role(UserType.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productService.remove(id);
  }
}
