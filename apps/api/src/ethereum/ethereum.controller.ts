import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserType } from 'src/auth/decorators/user-type.decorator';
import { SendTransactionDto } from './dto/send-transaction.dto';
import { EthereumService } from './ethereum.service';

@Controller('ethereum')
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  @Post('broadcast')
  @UserType('parent')
  @UseGuards(AuthGuard)
  async broadcastTransaction(@Body() body: SendTransactionDto) {
    return this.ethereumService.sendTransaction(body);
  }
}
