import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetParent } from 'src/auth/decorators/get-user.decorator';
import { UserType } from 'src/auth/decorators/user-type.decorator';
import { UserSessionPayload } from 'src/auth/session/dto/user-session.dto';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create')
  @UserType('parent')
  @UseGuards(AuthGuard)
  createWallet(
    @GetParent() user: UserSessionPayload,
    @Body() data: CreateWalletDto,
  ) {
    return this.walletService.createWallet(user.userId, data);
  }
}
