import { HttpService } from "@nestjs/axios";
import { Injectable, Inject } from "@nestjs/common";
import { lastValueFrom, map } from "rxjs";

interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in?: string;
}

@Injectable()
export class NestAuthService {
  constructor(private httpService: HttpService) {}

  getAccessToken$(provider: any, code: string) {
    return this.httpService
      .post<OAuthTokenResponse>(
        provider.token,
        {
          code: code,
          client_id: provider.clientId,
          client_secret: "e1a5542598e286578cda9369b1b51620ba491b6b",
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  async login(provider: any, code: string) {
    const data = await lastValueFrom(this.getAccessToken$(provider, code));

    const profile = await provider.userinfo.request(data.access_token);

    return {
      tokens: data,
      profile: profile,
      provider: provider.id,
    };
  }
}
