import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetParent } from 'src/auth/decorators/get-user.decorator';
import { UserType } from 'src/auth/decorators/user-type.decorator';
import { UserSessionPayload } from 'src/auth/session/dto/user-session.dto';
import { CreateChildrenDto } from './dto/create-children.dto';
import { ParentsService } from './parents.service';

@Controller('users/parents')
@ApiTags('Parents')
@UserType('parent')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  /**
   * Route to GET all parent's children
   *
   * @param user token payload with userId
   * @returns array of the parent's children
   */

  @Get('children')
  @UseGuards(AuthGuard)
  getChildren(@GetParent() user: UserSessionPayload) {
    return this.parentsService.getParentChildren(user.userId);
  }

  /**
   * Route to create new children
   *
   * @param user token payload with userId
   * @param data object containing data for creating the child
   * @returns
   */

  @Put('children')
  @UseGuards(AuthGuard)
  createChildren(
    @GetParent() user: UserSessionPayload,
    @Body() data: CreateChildrenDto,
  ) {
    return this.parentsService.createChildrenFromParent(user.userId, data);
  }
}
