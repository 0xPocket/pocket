import { IsEthereumAddress, IsString } from 'class-validator';

export class CreateWalletDto {
  @IsEthereumAddress()
  publicKey: string;

  @IsString()
  encryptedPrivateKey: string;
}
