import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserParent } from 'src/auth/decorators/get-user.decorator';
import { UserType } from 'src/auth/decorators/user-type.decorator';
import { JwtTokenPayload } from 'src/auth/jwt/dto/JwtTokenPayload.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { CreateChildrenDto } from './dto/create-children.dto';
import { ParentSignupDto } from './dto/parent-signup.dto';
import { ParentsService } from './parents.service';

@Controller('users/parents')
@ApiTags('Parents')
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
    return this.parentsService.localSignup(body);
  }

  /**
   * Route to confirm email
   * @param body
   * @returns
   */

  @Post('confirm-email')
  confirmEmail(@Body() body: ConfirmEmailDto) {
    return this.parentsService.confirmEmail(body.token);
  }

  /**
   * Route to GET all parent's children
   *
   * @param user token payload with userId
   * @returns array of the parent's children
   */

  @Get('children')
  @UseGuards(JwtAuthGuard)
  getChildren(@GetUserParent() user: JwtTokenPayload) {
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
  @UseGuards(JwtAuthGuard)
  createChildren(
    @GetUserParent() user: JwtTokenPayload,
    @Body() data: CreateChildrenDto,
  ) {
    return this.parentsService.createChildrenFromParent(user.userId, data);
  }
}
