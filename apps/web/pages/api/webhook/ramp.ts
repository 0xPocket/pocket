import type { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from 'crypto';
import type { PurchaseStatusWebhookEvent } from '@lib/types/interfaces';
import { prisma } from '../../../server/prisma';
import stringify from 'fast-json-stable-stringify';
import { sanitizeParent } from '../../../server/utils/sanitizeUser';

// PRODUCTION KEY
// const RAMP_KEY = `-----BEGIN PUBLIC KEY-----
// MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAElvxpYOhgdAmI+7oL4mABRAfM5CwLkCbZ
// m64ERVKAisSulWFC3oRZom/PeyE2iXPX1ekp9UD1r+51c9TiuIHU4w==
// -----END PUBLIC KEY-----`;

// TEST KEY
const RAMP_KEY = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEevN2PMEeIaaMkS4VIfXOqsLebj19kVeu
wWl0AnkIA6DJU0r3ixkXVhJTltycJtkDoEAYtPHfARyTofB5ZNw9xA==
-----END PUBLIC KEY-----`;

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(400).send('Bad Request');
  }

  const signature = req?.headers['x-body-signature'] as string | undefined;

  const body = req?.body as PurchaseStatusWebhookEvent | undefined;

  if (!body || !signature) {
    return false;
  }

  const jsonBody = stringify(body);

  const verified = crypto.verify(
    'sha256',
    Buffer.from(jsonBody),
    RAMP_KEY,
    Buffer.from(signature, 'base64'),
  );

  if (!verified) {
    return res.status(400).send('Bad Request');
  }

  const user = await prisma.user.findFirst({
    where: {
      address: {
        equals: body.purchase.receiverAddress,
        mode: 'insensitive',
      },
    },
  });

  if (!user) {
    return res.status(400).send('Bad Request');
  }

  const parent = sanitizeParent(
    await prisma.parent.findUnique({
      where: {
        userId: user?.id,
      },
      include: {
        user: true,
      },
    }),
  );

  if (!parent || parent.type !== 'Parent') {
    return res.status(400).send('Bad Request');
  }

  await prisma.ramp.upsert({
    where: {
      rampId: body.purchase.id,
    },
    update: {
      cryptoAmount: body.purchase.cryptoAmount,
      cryptoAsset: body.purchase.asset.symbol,
      fiatValue: body.purchase.fiatValue,
      fiatCurrency: body.purchase.fiatCurrency,
      appliedFee: body.purchase.appliedFee,
      status: body.type,
    },
    create: {
      rampId: body.purchase.id,
      createdAt: body.purchase.createdAt,
      cryptoAmount: body.purchase.cryptoAmount,
      cryptoAsset: body.purchase.asset.symbol,
      fiatValue: body.purchase.fiatValue,
      fiatCurrency: body.purchase.fiatCurrency,
      appliedFee: body.purchase.appliedFee,
      status: body.type,
      userParent: {
        connect: {
          userId: parent.id,
        },
      },
    },
  });

  return res.status(200).send('OK');
};
