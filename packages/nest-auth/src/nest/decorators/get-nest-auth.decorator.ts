import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { NestAuthData } from "../types";

export const GetNestAuth = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const nestAuthData: NestAuthData = request.nest_auth;
    return data ? nestAuthData[data] : nestAuthData;
  }
);
