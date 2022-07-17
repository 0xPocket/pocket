import { Injectable } from '@nestjs/common';
import { PurchaseStatusWebhookEvent } from './interfaces/RampWebhook';

@Injectable()
export class RampService {
  webhookRamp(body: PurchaseStatusWebhookEvent) {
    console.log(body);
    return 'OK';
  }
}
