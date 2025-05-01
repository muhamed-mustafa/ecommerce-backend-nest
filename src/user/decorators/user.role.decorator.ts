import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../utils/enums';

export const Role = (...roles: UserType[]) => SetMetadata('roles', roles);
