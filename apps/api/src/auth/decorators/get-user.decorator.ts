import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetParent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session.parent;
  },
);

export const GetChild = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session.child;
  },
);
