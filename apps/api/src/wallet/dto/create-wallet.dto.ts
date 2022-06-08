import { IsString } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  publicKey: string;

  @IsString()
  encryptedPrivateKey: string;
}
