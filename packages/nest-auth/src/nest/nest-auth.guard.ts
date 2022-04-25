import { Inject } from "@nestjs/common";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { NestAuthService } from "./nest-auth.service";

@Injectable()
export class NestAuthGuard implements CanActivate {
  constructor(
    private nestAuthService: NestAuthService,
    @Inject(Reflector.name)
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const provider = this.reflector.get<any>("provider", context.getHandler());

    const request = context.switchToHttp().getRequest();

    const code = request.body?.code;

    if (!code) return false;

    const data = await this.nestAuthService.login(provider, code);

    request.nest_auth = data;

    return true;
  }
}
