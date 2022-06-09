import { IsEmail, IsString } from 'class-validator';

export class CreateChildrenDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}
