import type { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from 'crypto';
import type { AlchemyAddressActivity } from '@lib/types/interfaces';
import { prisma } from '../../../server/prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(400).send('Bad Request');
  }

  const signing_key = process.env.ALCHEMY_WEBHOOK_SECRET!;

  const signature = req?.headers['x-alchemy-signature'];

  const body = req?.body as AlchemyAddressActivity;

  const hmac = crypto.createHmac('sha256', signing_key);

  hmac.update(JSON.stringify(body), 'utf8');

  const digest = hmac.digest('hex');

  if (signature !== digest) {
    return res.status(400).send('Bad Request');
  }

  for (const activity of body.event.activity) {
    const childFrom = await prisma.user.findUnique({
      where: { address: activity.fromAddress },
    });

    const childTo = await prisma.user.findUnique({
      where: { address: activity.toAddress },
    });

    if (
      !childFrom ||
      !childTo ||
      childFrom.type !== 'Child' ||
      childTo.type !== 'Child'
    ) {
      return res.status(400).send('Bad Request');
    }

    await prisma.activity
      .create({
        data: {
          id: body.id,
          fromAddress: activity.fromAddress,
          toAddress: activity.toAddress,
          blockNum: activity.blockNum,
          hash: activity.hash,
          category: activity.category,
          value: activity.value,
          asset: activity.asset,
          erc721TokenId: activity.erc721TokenId,
          createdAt: body.createdAt,
          child: {
            connect: [{ userId: childFrom.id }, { userId: childTo.id }],
          },
        },
      })
      .catch((err) => console.log(err));
  }

  res.status(200).json({ name: 'John Doe' });
};
