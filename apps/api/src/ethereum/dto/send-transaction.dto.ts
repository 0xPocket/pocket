import { IsString } from 'class-validator';

export class SendTransactionDto {
  @IsString()
  hash: string;
}
