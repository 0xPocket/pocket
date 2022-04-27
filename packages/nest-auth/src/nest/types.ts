export interface NestAuthUser {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface NestAuthData<T = NestAuthUser> {
  tokens: any;
  profile: T;
  provider: string;
}
