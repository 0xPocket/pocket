import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as superTestRequest from 'supertest';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';
import { ParentSignupDto } from 'src/users/parents/dto/parent-signup.dto';
import { LocalSigninDto } from 'src/auth/local/dto/local-signin.dto';
import { ParentsService } from 'src/users/parents/parents.service';
import { JwtAuthService } from 'src/auth/jwt/jwt-auth.service';
import * as session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaService } from 'src/prisma/prisma.service';

const PARENT = {
  firstName: 'Solal',
  lastName: 'Dunckel',
  email: 'solaldunckelb@gmail.com',
  password: 'test1234',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let parentsService: ParentsService;
  let jwtAuthService: JwtAuthService;
  let agent: superTestRequest.SuperAgentTest;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    parentsService = module.get<ParentsService>(ParentsService);
    jwtAuthService = module.get<JwtAuthService>(JwtAuthService);

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
    agent = superTestRequest.agent(app.getHttpServer());
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('Register the parent', () => {
    const body: ParentSignupDto = {
      ...PARENT,
    };

    it('PUT /users/parents - invalid arguments', () => {
      body.email = 'solaldunckel';
      return agent.put('/users/parents').send(body).expect(400);
    });

    it('PUT /users/parents - should create user', () => {
      body.email = PARENT.email;
      return parentsService.create(body, true);
    });

    it('PUT /users/parents - user already exists', () => {
      return agent.put('/users/parents').send(body).expect(400);
    });
  });

  // let access_token: string;

  describe('Confirm Email', () => {
    it('POST /users/parents/confirm-email - invalid token', () => {
      return agent
        .post('/users/parents/confirm-email')
        .send({ token: 'gadgadgadgaga' })
        .expect(400);
    });

    it('POST /users/parents/confirm-email - valid token with invalid email', () => {
      const token = jwtAuthService.generateEmailConfirmationToken(
        'sosodunckel@gmail.com',
      );

      return agent
        .post('/users/parents/confirm-email')
        .send({ token })
        .expect(400);
    });

    it('POST /users/parents/confirm-email - should confirm email', () => {
      const token = jwtAuthService.generateEmailConfirmationToken(PARENT.email);

      return agent
        .post('/users/parents/confirm-email')
        .send({ token })
        .expect(201);
    });
  });

  describe('Login', () => {
    const login: LocalSigninDto = {
      email: PARENT.email,
      password: PARENT.password,
    };

    it('POST /auth/local - invalid arguments', () => {
      login.email = 'solaldunckel';
      return agent.post('/auth/local').send(login).expect(400);
    });

    it('POST /auth/local - invalid email', () => {
      login.email = 'solaldunckeldunckel@gmail.com';
      return agent.post('/auth/local').send(login).expect(400);
    });

    it('POST /auth/local - invalid password', () => {
      login.email = PARENT.email;
      login.password = 'test12345';
      return agent.post('/auth/local').send(login).expect(403);
    });

    it('POST /auth/local - should be logged in', () => {
      login.email = PARENT.email;
      login.password = PARENT.password;
      return agent.post('/auth/local').send(login).expect(201);
      // access_token = res.body.access_token;
    });

    // it('GET /auth/me - should be unauthorized (JWT)', async async () => {
    //   await agent.get('/auth/me').expect(401);
    //   await agent
    //     .get('/auth/me')
    //     .set('Authorization', `Bearer invalid_token_adgaga`)
    //     .expect(401);
    //   // await agent.get('/auth/me').expect(401);
    // });

    // it('GET /auth/me - should return the user (JWT)', async async () => {
    //   const res = await agent
    //     .get('/auth/me')
    //     .set('Authorization', `Bearer ${access_token}`)
    //     .expect(200);
    //   expect(res.body.email).toBe(PARENT.email);
    // });

    it('GET /auth/parents/me - should be unauthorized (session)', () => {
      return superTestRequest(app.getHttpServer())
        .get('/auth/parents/me')
        .expect(403);
      // await agent.get('/auth/parents/me').expect(401);
    });

    it('GET /auth/parents/me - should return the user (session)', async () => {
      const res = await agent
        .get('/auth/parents/me')
        .withCredentials()
        .expect(200);
      return expect(res.body.email).toBe(PARENT.email);
    });
  });
});
