import { HttpService } from "@nestjs/axios";
import { Injectable, Param, UnauthorizedException } from "@nestjs/common";
import { OAuth2Provider } from "../providers/types";
import { lastValueFrom, map } from "rxjs";

interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in?: string;
}

export function encodeQuery(queryObject: {
  [key: string]: string | number | boolean | undefined;
}): string {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== "undefined")
    .map(
      ([key, value]) =>
        encodeURIComponent(key) +
        (value != null ? "=" + encodeURIComponent(value) : "")
    )
    .join("&");
}

@Injectable()
export class NestAuthService {
  constructor(private httpService: HttpService) {}

  getAccessToken$(provider: OAuth2Provider, code: string) {
    return this.httpService
      .post<OAuthTokenResponse>(
        provider.endpoints.token!,
        {
          code: code,
          client_id: provider.clientId,
          client_secret: provider.secretId,
          redirect_uri: provider.redirectUri,
          grant_type: "authorization_code",
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
      .post<unknown>(
        provider.endpoints.userInfo,
        {},
        {
          params: provider.params,
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  async login(provider: OAuth2Provider, code: string) {
    try {
      const data = await lastValueFrom(this.getAccessToken$(provider, code));

      const profile = await lastValueFrom(
        this.getUserProfile$(provider, data.access_token)
      );

      console.log(profile);

      return {
        tokens: data,
        profile: profile,
        provider: provider.id,
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
