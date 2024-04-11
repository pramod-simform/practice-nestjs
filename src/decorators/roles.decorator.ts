import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/config/constants';
import { UserRoles } from 'src/types/common.enums';

export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);