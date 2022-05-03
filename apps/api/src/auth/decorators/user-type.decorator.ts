import { SetMetadata } from '@nestjs/common';

type IUserType = 'parent' | 'child';

export const UserType = (type: IUserType) => SetMetadata('type', type);
