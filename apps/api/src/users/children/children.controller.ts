import { Controller } from '@nestjs/common';
import { ChildrenService } from './children.service';

@Controller('users/children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}
}
