import { Test, TestingModule } from '@nestjs/testing';
import { ChildrenController } from './children.controller';
import { ChildrenService } from './children.service';

describe('ChildrenController', () => {
  let controller: ChildrenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildrenController],
      providers: [ChildrenService],
    }).compile();

    controller = module.get<ChildrenController>(ChildrenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
