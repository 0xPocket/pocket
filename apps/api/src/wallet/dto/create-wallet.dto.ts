import { IsString } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  password: string;

  @IsString()
  privateKey: string;
}
