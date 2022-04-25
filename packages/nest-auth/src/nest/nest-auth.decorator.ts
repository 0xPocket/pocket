import { applyDecorators, Post, SetMetadata, UseGuards } from "@nestjs/common";
import { NestAuthGuard } from "./nest-auth.guard";

export function NestAuth(provider: any): MethodDecorator & ClassDecorator {
  console.log(provider);
  if (provider.type === "credentials") {
    return applyDecorators(Post(provider.id));
  }
  return applyDecorators(
    Post(provider.id),
    SetMetadata("provider", provider),
    UseGuards(NestAuthGuard)
  );
}
