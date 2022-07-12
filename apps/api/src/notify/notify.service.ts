import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlchemyAddressActivity } from './interfaces/AlchemyWebhook';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotifyService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async webhookAlchemy(body: AlchemyAddressActivity) {
    for (const activity of body.event.activity) {
      const childFrom = await this.prisma.web3Account.findUnique({
        where: { address: activity.fromAddress },
      });

      const childTo = await this.prisma.web3Account.findUnique({
        where: { address: activity.toAddress },
      });

      if (!childFrom || !childTo) {
        throw new BadRequestException('Child not found');
      }

      await this.prisma.activity
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
              connect: [{ id: childFrom.id }, { id: childTo.id }],
            },
          },
        })
        .catch((err) => console.log(err));
    }
    return 'OK';
  }

  async addAddressToWebhook(address: string) {
    return axios
      .patch(
        'https://dashboard.alchemyapi.io/api/update-webhook-addresses',
        {
          webhook_id: this.configService.get('ALCHEMY_WEBHOOK_ID'),
          addresses_to_add: [address],
          addresses_to_remove: [],
        },
        {
          headers: {
            'X-Alchemy-Token': this.configService.get('ALCHEMY_AUTH_TOKEN'),
          },
        },
      )
      .catch((err) => console.log(err));
  }
}
