import { Transform, TransformFnParams } from 'class-transformer';
import { IsEthereumAddress } from 'class-validator';

export class MetamaskNonceDto {
  @IsEthereumAddress()
  @Transform((params: TransformFnParams) => params.value.toLowerCase())
  walletAddress: string;
}
