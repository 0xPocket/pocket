import { Injectable } from '@nestjs/common';
import { SHA256 } from 'crypto-js';

@Injectable()
export class PasswordService {
  encryptPassword(password: string) {
    return SHA256(password).toString();
  }

  comparePassword(plainPassword: string, hash: string) {
    return SHA256(plainPassword).toString() === hash;
  }
}
