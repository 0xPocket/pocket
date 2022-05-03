import { IsString } from 'class-validator';

export class MetamaskTokenDto {
  @IsString()
  token: string;

  @IsString()
  walletAddress: string;
}
