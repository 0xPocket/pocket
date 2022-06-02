import { Transform, TransformFnParams } from 'class-transformer';
import { IsString } from 'class-validator';

export class MetamaskTokenDto {
  @IsString()
  token: string;

  @IsString()
  @Transform((params: TransformFnParams) => params.value.toLowerCase())
  walletAddress: string;

  @IsString()
  signature: string;
}
