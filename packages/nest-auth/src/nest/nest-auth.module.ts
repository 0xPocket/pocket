import { HttpModule } from "@nestjs/axios";
import { DynamicModule, Module } from "@nestjs/common";
import { NestAuthService } from "./nest-auth.service";

@Module({})
export class NestAuthModule {
  static forRoot(): DynamicModule {
    return {
      module: NestAuthModule,
      imports: [HttpModule],
      providers: [NestAuthService],
      exports: [NestAuthService],
    };
  }
}
