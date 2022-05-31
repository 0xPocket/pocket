import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AlchemyGuard } from './alchemy.guard';
import { AlchemyAddressActivity } from './interfaces/AlchemyWebhook';
import { NotifyService } from './notify.service';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post('webhook')
  @UseGuards(AlchemyGuard)
  webhookAlchemy(@Req() req: Request) {
    // console.log(req.body);
    const alchemy = req.body as AlchemyAddressActivity;

    console.log(alchemy.event.activity);
  }
}
