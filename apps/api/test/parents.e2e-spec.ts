import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';
import { ParentsService } from 'src/users/parents/parents.service';
import { CreateChildrenDto } from 'src/users/parents/dto/create-children.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

const CHILD = {
  email: 'solaldunckelb@gmail.com',
  firstName: 'Solal',
  lastName: 'Dunckel',
};
const EMAIL_TEST = !!process.env.EMAIL_TEST;

describe('ParentsController (e2e)', () => {
  let app: INestApplication;
  let parentsService: ParentsService;
  const userId = 'elonmusk';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { userId };
          return true;
        },
      })
      .compile();

    parentsService = module.get<ParentsService>(ParentsService);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('Create a children', () => {
    const child: CreateChildrenDto = {
      ...CHILD,
    };

    it('PUT /users/parents - invalid email', () => {
      child.email = 'theopalhol';
      return request(app.getHttpServer())
        .put('/users/parents/children')
        .send(child)
        .expect(400);
    });

    it('PUT /users/parents - should create the child', () => {
      child.email = CHILD.email;
      return parentsService.createChildrenFromParent(userId, child, EMAIL_TEST);
    });

    it('PUT /users/parents - child already exists', async () => {
      return expect(
        parentsService.createChildrenFromParent(userId, child, EMAIL_TEST),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe(`Get parent children`, () => {
    it('GET /users/parents/children - should get children', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/parents/children')
        .expect(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ email: CHILD.email }),
        ]),
      );
    });
  });
});
