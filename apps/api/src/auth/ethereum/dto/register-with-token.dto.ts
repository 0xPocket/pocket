import { IsObject, IsString } from 'class-validator';
import { SiweMessage } from 'siwe';

export class RegisterWithTokenDto {
  @IsString()
  token: string;

  @IsObject()
  message: SiweMessage;

  @IsString()
  signature: string;
}
