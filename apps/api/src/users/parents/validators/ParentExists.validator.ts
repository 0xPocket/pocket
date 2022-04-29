import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'ParentExists', async: true })
@Injectable()
export class ParentExistsRule implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(email: string) {
    try {
      const found = await this.prisma.userParent.findUnique({
        where: {
          email: email,
        },
      });
      if (found && found.emailVerified) return false;
    } catch (e) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return `User already exists`;
  }
}

/**
 * Rule to check if the parent with the same email already exists in the database
 */

export function IsParentAlreadyExists(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ParentExistsRule,
    });
  };
}
