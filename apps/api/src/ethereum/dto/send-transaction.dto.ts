import { IsEnum, IsOptional, IsString } from 'class-validator';

enum Type {
  ADD_CHILD,
}

export class SendTransactionDto {
  @IsString()
  hash: string;

  @IsEnum(Type)
  type: Type;

  @IsOptional()
  @IsString()
  childAddress: string;
}
