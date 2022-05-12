import { Transform, TransformFnParams } from 'class-transformer';
import { IsString } from 'class-validator';

export class MetamaskNonceDto {
  @IsString()
  @Transform((params: TransformFnParams) => params.value.toLowerCase())
  walletAddress: string;
}
