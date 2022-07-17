import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PurchaseStatusWebhookEvent } from './interfaces/RampWebhook';
import { AlchemyGuard } from './ramp.guard';
import { RampService } from './ramp.service';

@Controller('ramp')
export class RampController {
  constructor(private readonly rampService: RampService) {}

  @Post('webhook')
  @UseGuards(AlchemyGuard)
  webhookAlchemy(@Body() body: PurchaseStatusWebhookEvent) {
    return this.rampService.webhookRamp(body);
  }
}
