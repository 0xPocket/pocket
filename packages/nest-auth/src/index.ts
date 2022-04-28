export interface NestAuthUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
}

export interface NestAuthTokenPayload {
  access_token: string;
}
