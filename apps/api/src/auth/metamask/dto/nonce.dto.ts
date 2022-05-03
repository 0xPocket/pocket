import { IsString } from 'class-validator';

export class MetamaskNonceDto {
  @IsString()
  walletAddress: string;
}
