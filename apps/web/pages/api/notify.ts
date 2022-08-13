import type { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from 'crypto';
import { AlchemyAddressActivity } from '@lib/types/interfaces';

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
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

  // for (const activity of body.event.activity) {
  //   const childFrom = await this.prisma.web3Account.findUnique({
  //     where: { address: activity.fromAddress },
  //   });

  //   const childTo = await this.prisma.web3Account.findUnique({
  //     where: { address: activity.toAddress },
  //   });

  //   if (!childFrom || !childTo) {
  //     throw new BadRequestException('Child not found');
  //   }

  //   await this.prisma.activity
  //     .create({
  //       data: {
  //         id: body.id,
  //         fromAddress: activity.fromAddress,
  //         toAddress: activity.toAddress,
  //         blockNum: activity.blockNum,
  //         hash: activity.hash,
  //         category: activity.category,
  //         value: activity.value,
  //         asset: activity.asset,
  //         erc721TokenId: activity.erc721TokenId,
  //         createdAt: body.createdAt,
  //         child: {
  //           connect: [{ id: childFrom.id }, { id: childTo.id }],
  //         },
  //       },
  //     })
  //     .catch((err) => console.log(err));
  // }

  res.status(200).json({ name: 'John Doe' });
};
