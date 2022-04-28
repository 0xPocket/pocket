import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtTokenPayload } from './dto/JwtTokenPayload.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const type = this.reflector.get<'parent' | 'child'>(
      'type',
      context.getHandler(),
    );

    if (!type) return true;

    const req = context.switchToHttp().getRequest();
    const payload: JwtTokenPayload = req.user;

    if (type === 'child' && payload.isParent) {
      return false;
    }

    if (type === 'parent' && !payload.isParent) {
      return false;
    }

    return true;
  }
}
