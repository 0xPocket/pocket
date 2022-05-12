import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AlchemyGuard } from './alchemy.guard';
import { NotifyService } from './notify.service';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post('webhook')
  @UseGuards(AlchemyGuard)
  webhookAlchemy(@Req() req: Request) {
    console.log(req);
  }
}
