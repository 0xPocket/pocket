import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PurchaseStatusWebhookEvent } from './interfaces/RampWebhook';

@Injectable()
export class RampService {
  constructor(private prisma: PrismaService) {}

  async webhookRamp(body: PurchaseStatusWebhookEvent) {
    const parentWallet = await this.prisma.userParentWallet.findFirst({
      where: {
        publicKey: body.purchase.receiverAddress.toLowerCase(),
      },
    });

    if (parentWallet) {
      await this.prisma.ramp.upsert({
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
              id: parentWallet.userParentId,
            },
          },
        },
      });
    }
    return 'OK';
  }
}
