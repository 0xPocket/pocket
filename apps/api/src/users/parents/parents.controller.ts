import { Body, Controller, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParentSignupDto } from './dto/parent-signup.dto';
import { ParentsService } from './parents.service';

@Controller('users/parents')
@ApiTags('users/parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Put()
  signup(@Body() body: ParentSignupDto) {
    return this.parentsService.create(body);
  }
}
