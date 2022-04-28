import { IsEmail, IsString } from 'class-validator';
import { IsParentAlreadyExists } from '../validators/ParentExists.validator';

export class ParentSignupDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  @IsParentAlreadyExists()
  email: string;

  /**
   * TODO: add regex for a secure password
   */
  @IsString()
  password?: string;
}
