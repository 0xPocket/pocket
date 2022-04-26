import { applyDecorators, Post, SetMetadata, UseGuards } from "@nestjs/common";
import { NestAuthProvider } from "../providers/types";
import * as PROVIDERS from "../providers";
import { NestAuthGuard } from "./nest-auth.guard";

export function NestAuth(
  providerId: string,
  options: Partial<NestAuthProvider>
): MethodDecorator & ClassDecorator {
  if (!PROVIDERS[providerId]) {
    return applyDecorators();
  }
  const strategy: NestAuthProvider = PROVIDERS[providerId](options);

  if (strategy.type === "credentials") {
    return applyDecorators(Post(strategy.id));
  }

  return applyDecorators(
    Post(strategy.id),
    SetMetadata("strategy", strategy),
    UseGuards(NestAuthGuard)
  );
}
