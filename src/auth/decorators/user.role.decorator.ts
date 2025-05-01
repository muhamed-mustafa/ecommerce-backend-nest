import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../utils/enums';

export const roles = (...roles: UserType[]) => SetMetadata('roles', roles);
