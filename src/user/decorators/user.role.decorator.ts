import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/utils/enums';

export const Role = (...roles: UserType[]) => SetMetadata('roles', roles);
