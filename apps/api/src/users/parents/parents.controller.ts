import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserParent } from 'src/auth/decorators/get-user.decorator';
import { UserType } from 'src/auth/decorators/user-type.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateChildrenDto } from './dto/create-children.dto';
import { ParentSignupDto } from './dto/parent-signup.dto';
import { ParentsService } from './parents.service';

@Controller('users/parents')
@ApiTags('users/parents')
@UserType('parent')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  /**
   * Route to locally signup for parents
   * @param body
   * @returns
   */

  @Put()
  signup(@Body() body: ParentSignupDto) {
    return this.parentsService.create(body);
  }

  /**
   * Route to GET a parent's children
   *
   * @param parentId id of the parent
   * @returns array of the parent's children
   */

  @Get('children')
  @UseGuards(JwtAuthGuard)
  getChildren(@GetUserParent() parentId: string) {
    return this.parentsService.getParentChildren(parentId);
  }

  /**
   *
   * @param parentId id of the parent
   * @param data object containing data for creating the child
   * @returns
   */

  @Put('children')
  @UseGuards(JwtAuthGuard)
  createChildren(
    @GetUserParent() parentId: string,
    @Body() data: CreateChildrenDto,
  ) {
    return this.parentsService.createChildrenFromParent(parentId, data);
  }
}
