import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AlchemyGuard } from './alchemy.guard';
import { AlchemyAddressActivity } from './interfaces/AlchemyWebhook';
import { NotifyService } from './notify.service';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post('webhook')
  @UseGuards(AlchemyGuard)
  webhookAlchemy(@Body() body: AlchemyAddressActivity) {
    console.log('ALCHEMY NOTIFY : ' + body.id);

    return this.notifyService.webhookAlchemy(body);
  }
}
