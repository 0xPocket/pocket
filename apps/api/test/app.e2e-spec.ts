import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';
import { ParentSignupDto } from 'src/users/parents/dto/parent-signup.dto';
import { LocalSigninDto } from 'src/auth/local/dto/local-signin.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('HTTP Server', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Parents Flow', () => {
    describe('Register the user', () => {
      const body: ParentSignupDto = {
        firstName: 'Theo',
        lastName: 'Palhol',
        email: 'theopalhol@gmail.com',
        password: 'test1234',
      };

      it('PUT /users/parents - wrong arguments', () => {
        body.email = 'theopalhol';
        return request(app.getHttpServer())
          .put('/users/parents')
          .send(body)
          .expect(400);
      });

      it('PUT /users/parents - should create user', () => {
        body.email = 'theopalhol@gmail.com';
        return request(app.getHttpServer())
          .put('/users/parents')
          .send(body)
          .expect(200);
      });

      it('PUT /users/parents - user already exists', () => {
        return request(app.getHttpServer())
          .put('/users/parents')
          .send(body)
          .expect(500);
      });
    });

    describe('Login', () => {
      const login: LocalSigninDto = {
        email: 'theopalhol@gmail.com',
        password: 'test1234',
      };

      it('GET /auth/me - should be unauthorized', () => {
        return request(app.getHttpServer()).get('/auth/me').expect(401);
      });

      it('POST /auth/local - wrong arguments', () => {
        login.email = 'theopalhol';
        return request(app.getHttpServer())
          .post('/auth/local')
          .send(login)
          .expect(400);
      });

      it('POST /auth/local - should be logged in', () => {
        login.email = 'theopalhol@gmail.com';
        return request(app.getHttpServer())
          .post('/auth/local')
          .send(login)
          .expect(201);
      });
    });
  });
});
