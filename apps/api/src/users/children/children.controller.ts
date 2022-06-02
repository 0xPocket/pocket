import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { IsRelatedGuard } from '../parents/guards/IsRelated.guard';
import { ChildrenService } from './children.service';

@Controller('users/children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get(':id')
  @UseGuards(AuthGuard, IsRelatedGuard)
  getChildById(@Param('id') id: string) {
    return this.childrenService.getChild(id);
  }
}
