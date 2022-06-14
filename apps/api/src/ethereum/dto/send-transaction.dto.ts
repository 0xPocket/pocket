import { IsEnum, IsString, ValidateIf } from 'class-validator';

export enum TransactionType {
  ADD_CHILD = 'ADD_CHILD',
  CHANGE_CONFIG = 'CHANGE_CONFIG',
}

export class SendTransactionDto {
  @IsString()
  hash: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @ValidateIf(
    (val: SendTransactionDto) => val.type === TransactionType.ADD_CHILD,
  )
  @IsString()
  childAddress: string;
}
