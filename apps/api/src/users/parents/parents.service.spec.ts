import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ParentsService } from './parents.service';

describe('ParentsService', () => {
  let service: ParentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ParentsService],
    }).compile();

    service = module.get<ParentsService>(ParentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
