import { Inject } from "@nestjs/common";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { OAuth2Provider } from "../providers/types";
import { NestAuthService } from "./nest-auth.service";

@Injectable()
export class NestAuthGuard implements CanActivate {
  constructor(
    private nestAuthService: NestAuthService,
    @Inject(Reflector.name)
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const strategy = this.reflector.get<OAuth2Provider>(
      "strategy",
      context.getHandler()
    );

    const request = context.switchToHttp().getRequest();

    const code = request.body?.code;

    if (!code) return false;

    try {
      const data = await this.nestAuthService.login(strategy, code);

      request.nest_auth = data;
    } catch (e) {
      return false;
    }

    return true;
  }
}
