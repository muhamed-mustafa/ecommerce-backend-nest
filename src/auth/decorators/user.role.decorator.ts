import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/utils/enums';

export const roles = (...roles: UserType[]) => SetMetadata('roles', roles);
