import { IsObject, IsString } from 'class-validator';
import { SiweMessage } from 'siwe';

export class VerifyMessageDto {
  @IsObject()
  message: SiweMessage;

  @IsString()
  signature: string;
}
