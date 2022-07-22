import { IsEmail, IsString } from 'class-validator';

export class CreateChildrenDto {
  @IsString()
  firstName: string;

  @IsEmail()
  email: string;
}
