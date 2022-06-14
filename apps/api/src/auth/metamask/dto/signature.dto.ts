import { Transform, TransformFnParams } from 'class-transformer';
import { IsEthereumAddress, IsString } from 'class-validator';

export class MetamaskSignatureDto {
  @IsString()
  signature: string;

  @IsEthereumAddress()
  @Transform((params: TransformFnParams) => params.value.toLowerCase())
  walletAddress: string;
}
