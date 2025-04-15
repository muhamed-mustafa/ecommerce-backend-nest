import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from './decorators/user.role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRoleGuard } from './guards/auth.guard.roles';
import { UpdateUserDto } from './dto/update.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthRoleGuard)
  @Role(UserType.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthRoleGuard)
  @Role(UserType.ADMIN, UserType.USER)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthRoleGuard)
  @Role(UserType.ADMIN, UserType.USER)
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
