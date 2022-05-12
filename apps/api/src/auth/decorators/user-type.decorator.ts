import { SetMetadata } from '@nestjs/common';

export type IUserType = 'parent' | 'child';

export const UserType = (type: IUserType) => SetMetadata('type', type);
