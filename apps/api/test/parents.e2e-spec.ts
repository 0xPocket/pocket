import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as superTestRequest from 'supertest';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';
import { ParentsService } from 'src/users/parents/parents.service';
import { CreateChildrenDto } from 'src/users/parents/dto/create-children.dto';
import * as session from 'express-session';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as superTestSession from 'supertest-session';
import { LocalSigninDto } from 'src/auth/local/dto/local-signin.dto';

const PARENT = {
  email: 'elonmusk@gmail.com',
  password: 'elonmusk',
};
const login: LocalSigninDto = {
  email: PARENT.email,
  password: PARENT.password,
};
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
  let agent: superTestRequest.SuperAgentTest;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    // .overrideGuard(AuthGuard)
    // .useValue({
    //   canActivate: (context: ExecutionContext) => {
    //     const req = context.switchToHttp().getRequest();
    //     req.session = {};
    //     req.session.parent = { userId, isParent: true };
    //     return true;
    //   },
    // })
    // .compile();

    parentsService = module.get<ParentsService>(ParentsService);

    app = module.createNestApplication();
    const prisma = app.get(PrismaService);
    app.use(
      session({
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
        },
        store: new PrismaSessionStore(prisma, {
          checkPeriod: 2 * 60 * 1000, //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }),
      }),
    );
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
    agent = superTestSession(app.getHttpServer());
    await agent.post('/auth/local').send(login); //login
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('Create a children - PUT /users/parents/children', () => {
    const child: CreateChildrenDto = {
      ...CHILD,
    };

    it('invalid email', async () => {
      child.email = 'theopalhol';
      await agent.put('/users/parents/children').send(child).expect(400);
    });

    it('should create the child', () => {
      child.email = CHILD.email;
      return parentsService.createChildrenFromParent(userId, child, EMAIL_TEST);
    });

    it('child already exists', async () => {
      return expect(
        parentsService.createChildrenFromParent(userId, child, EMAIL_TEST),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe(`Get parent children - GET /users/parents/children`, () => {
    it('should get children', async () => {
      const res = await agent.get('/users/parents/children').expect(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ email: CHILD.email }),
        ]),
      );
    });
  });
});
