import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUserType } from './decorators/user-type.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.session) return false;

    if (!request.session.parent && !request.session.child) return false;

    const type = this.reflector.get<IUserType>('type', context.getHandler());

    if (!type) return true;

    if (type === 'child' && !request.session.child) {
      return false;
    }

    if (type === 'parent' && !request.session.parent) {
      return false;
    }

    return true;
  }
}
