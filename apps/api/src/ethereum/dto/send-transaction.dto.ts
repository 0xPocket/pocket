import { IsEnum, IsString, ValidateIf } from 'class-validator';

export enum TransactionType {
  ADD_CHILD = 'ADD_CHILD',
  CHANGE_CONFIG = 'CHANGE_CONFIG',
  FUNDS_ADDED = 'FUNDS_ADDED',
}

export class SendTransactionDto {
  @IsString()
  hash: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @ValidateIf(
    (val: SendTransactionDto) =>
      val.type === TransactionType.ADD_CHILD ||
      val.type === TransactionType.FUNDS_ADDED,
  )
  @IsString()
  childAddress: string;
}
