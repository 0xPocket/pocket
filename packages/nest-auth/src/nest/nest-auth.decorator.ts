import {
  applyDecorators,
  CanActivate,
  Post,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { NestAuthProvider, NestOAuth2UserConfig } from "../providers/types";
import * as PROVIDERS from "../providers";
import { NestAuthGuard } from "./nest-auth.guard";

/**
 * This decorator will create a route POST /[id]
 *
 * @param providerId id of the provider (eg. `facebook`)
 * @param options object containing at least clientId and clientSecret
 * @param guards optional - a single guard instance or class, or a list of guard instances or classes
 *
 * @usageNotes
 * You get access to nest_auth in the request or via `@GetNestAuth` decorator
 */

export function NestAuth(
  providerId: string,
  options: NestOAuth2UserConfig,
  ...guards: CanActivate[] | Function[]
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
    UseGuards(NestAuthGuard, ...guards)
  );
}
