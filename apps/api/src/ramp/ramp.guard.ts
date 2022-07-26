import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stringify = require('fast-json-stable-stringify');

console.log(__dirname);

const RAMP_PRODUCTION_KEY = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAElvxpYOhgdAmI+7oL4mABRAfM5CwLkCbZ
m64ERVKAisSulWFC3oRZom/PeyE2iXPX1ekp9UD1r+51c9TiuIHU4w==
-----END PUBLIC KEY-----`;

const RAMP_TEST_KEY = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEevN2PMEeIaaMkS4VIfXOqsLebj19kVeu
wWl0AnkIA6DJU0r3ixkXVhJTltycJtkDoEAYtPHfARyTofB5ZNw9xA==
-----END PUBLIC KEY-----`;

@Injectable()
export class AlchemyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const headers = request.headers;
    const signature = headers['x-body-signature'];
    const body = request.body;

    if (!body || !signature) {
      return false;
    }

    const jsonBody = stringify(body);

    const verified = crypto.verify(
      'sha256',
      Buffer.from(jsonBody),
      RAMP_TEST_KEY,
      Buffer.from(signature, 'base64'),
    );

    return verified;
  }
}
