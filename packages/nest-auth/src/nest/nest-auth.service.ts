import { HttpService } from "@nestjs/axios";
import { Injectable, Inject } from "@nestjs/common";
import { OAuth2Provider } from "../providers/types";
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

  getAccessToken$(provider: OAuth2Provider, code: string) {
    // console.log(provider);
    return this.httpService
      .post<OAuthTokenResponse>(
        provider.endpoints.token!,
        {
          code: code,
          client_id: provider.clientId,
          client_secret: provider.secretId,
          redirect_uri: provider.redirectUri,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  getUserProfile$(provider: OAuth2Provider, access_token: string) {
    return this.httpService
      .post<OAuthTokenResponse>(
        provider.endpoints.userInfo,
        {},
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  async login(provider: OAuth2Provider, code: string) {
    try {
      if (provider.endpoints.token) {
        const data = await lastValueFrom(this.getAccessToken$(provider, code));

        const profile = await lastValueFrom(
          this.getUserProfile$(provider, data.access_token)
        );

        return {
          tokens: data,
          profile: profile,
          provider: provider.id,
        };
      } else {
        const profile = await lastValueFrom(
          this.getUserProfile$(provider, code)
        );

        return {
          tokens: code,
          profile: profile,
          provider: provider.id,
        };
      }
    } catch (e) {
      console.log(e);
    }
  }
}
