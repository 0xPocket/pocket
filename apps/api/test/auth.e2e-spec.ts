import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';
import { ParentSignupDto } from 'src/users/parents/dto/parent-signup.dto';
import { LocalSigninDto } from 'src/auth/local/dto/local-signin.dto';
import { ParentsService } from 'src/users/parents/parents.service';
import { JwtAuthService } from 'src/auth/jwt/jwt-auth.service';

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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    parentsService = module.get<ParentsService>(ParentsService);
    jwtAuthService = module.get<JwtAuthService>(JwtAuthService);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
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
      return request(app.getHttpServer())
        .put('/users/parents')
        .send(body)
        .expect(400);
    });

    it('PUT /users/parents - should create user', () => {
      body.email = PARENT.email;
      return parentsService.create(body, true);
    });

    it('PUT /users/parents - user already exists', () => {
      return request(app.getHttpServer())
        .put('/users/parents')
        .send(body)
        .expect(400);
    });
  });

  let access_token: string;

  describe('Confirm Email', () => {
    it('POST /users/parents/confirm-email - invalid token', () => {
      return request(app.getHttpServer())
        .post('/users/parents/confirm-email')
        .send({ token: 'gadgadgadgaga' })
        .expect(400);
    });

    it('POST /users/parents/confirm-email - valid token with invalid email', () => {
      const token = jwtAuthService.generateEmailConfirmationToken(
        'sosodunckel@gmail.com',
      );

      return request(app.getHttpServer())
        .post('/users/parents/confirm-email')
        .send({ token })
        .expect(400);
    });

    it('POST /users/parents/confirm-email - should confirm email', () => {
      const token = jwtAuthService.generateEmailConfirmationToken(PARENT.email);

      return request(app.getHttpServer())
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
      return request(app.getHttpServer())
        .post('/auth/local')
        .send(login)
        .expect(400);
    });

    it('POST /auth/local - invalid email', () => {
      login.email = 'solaldunckeldunckel@gmail.com';
      return request(app.getHttpServer())
        .post('/auth/local')
        .send(login)
        .expect(400);
    });

    it('POST /auth/local - invalid password', () => {
      login.email = PARENT.email;
      login.password = 'test12345';
      return request(app.getHttpServer())
        .post('/auth/local')
        .send(login)
        .expect(403);
    });

    it('POST /auth/local - should be logged in', async () => {
      login.email = PARENT.email;
      login.password = PARENT.password;
      const res = await request(app.getHttpServer())
        .post('/auth/local')
        .send(login)
        .expect(201);
      access_token = res.body.access_token;
    });

    it('GET /auth/me - should be unauthorized', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer invalid_token_adgaga`)
        .expect(401);
      // return request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('GET /auth/me - should return the user', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);
      expect(res.body.email).toBe(PARENT.email);
    });
  });
});
