import { IsEmail, IsString } from 'class-validator';

export class LocalSigninDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
