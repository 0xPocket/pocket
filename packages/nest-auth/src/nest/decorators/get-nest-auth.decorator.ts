import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetNestAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.nest_auth;
  }
);
