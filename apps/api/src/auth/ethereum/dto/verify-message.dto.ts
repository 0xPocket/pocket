import { IsString } from 'class-validator';

export class VerifyMessageDto {
  @IsString()
  message: string;

  @IsString()
  signature: string;
}
