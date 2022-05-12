import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AlchemyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const signing_key = 'whsec_lQsMZyco8amJMbfn7jrD5Z1X';

    const headers = request.headers;
    const signature = headers['x-alchemy-signature'];
    const body = request.body;

    const hmac = crypto.createHmac('sha256', signing_key); // Create a HMAC SHA256 hash using the auth token
    hmac.update(JSON.stringify(body), 'utf8'); // Update the token hash with the request body using utf8
    const digest = hmac.digest('hex');
    console.log(signature);
    console.log(digest);
    return signature === digest;
  }
}
