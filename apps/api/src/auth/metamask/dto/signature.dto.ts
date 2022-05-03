import { IsString } from 'class-validator';

export class MetamaskSignatureDto {
  @IsString()
  signature: string;

  @IsString()
  walletAddress: string;
}
