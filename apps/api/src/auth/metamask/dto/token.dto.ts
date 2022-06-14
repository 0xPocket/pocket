import { Transform, TransformFnParams } from 'class-transformer';
import { IsEthereumAddress, IsString } from 'class-validator';

export class MetamaskTokenDto {
  @IsString()
  token: string;

  @IsEthereumAddress()
  @Transform((params: TransformFnParams) => params.value.toLowerCase())
  walletAddress: string;

  @IsString()
  signature: string;
}
