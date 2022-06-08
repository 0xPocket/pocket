import { IsEnum, IsObject, IsString } from 'class-validator';

enum Type {
  ADD_CHILD,
}

class TransactionTypeDto {
  @IsEnum(Type)
  type: Type;

  @IsString()
  childAddress: string;
}

export class SendTransactionDto {
  @IsString()
  hash: string;

  @IsObject()
  type?: TransactionTypeDto;
}
