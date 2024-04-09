import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import { AuthLogInBodyDto } from 'src/modules/auth/auth.dto';
import { AuthModule } from 'src/modules/auth/auth.module';
import { GamesModule } from 'src/modules/games/games.module';
import {
  UserCreatePayload,
  UserResponseDto,
} from 'src/modules/users/users.dto';
import { UsersModule } from 'src/modules/users/users.module';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, UsersModule, GamesModule, PrismaClient],
    })
      .setLogger(new Logger())
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);

    await prismaClient.$executeRaw`TRUNCATE "public"."games" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."users" RESTART IDENTITY CASCADE;`;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  const user: UserCreatePayload = {
    email: 'jane.doe@e2e.test',
    firstname: 'Jane',
    lastname: 'Doe',
    password: '12345678',
  };

  const signup = async (): Promise<UserResponseDto> => {
    const result = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user);
    return result.body as UserResponseDto;
  };

  const login = async (): Promise<string> => {
    const body: AuthLogInBodyDto = {
      email: user.email,
      password: user.password,
    };
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(body)
      .expect(200);
    const cookies = loginRes.header['set-cookie'];
    return cookies;
  };

  const logout = (cookies: string) => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', cookies)
      .expect(200);
  };

  const truncateUsers = async () =>
    await prismaClient.$executeRaw`TRUNCATE "public"."users" RESTART IDENTITY CASCADE;`;

  const truncateGames = async () =>
    await prismaClient.$executeRaw`TRUNCATE "public"."games" RESTART IDENTITY CASCADE;`;

  describe('/auth/signup (POST)', () => {
    it('should create a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login a user', async () => {
      const body: AuthLogInBodyDto = {
        email: user.email,
        password: user.password,
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(body)
        .expect(200);

      expect(response.body).toEqual({
        user: {
          id: expect.any(Number),
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        },
        token: expect.any(String),
      });

      const cookies = response.header['set-cookie'];
      logout(cookies);
    });

    it('should not login a user', async () => {
      const user = {
        email: 'wronguser@e2e.test',
        password: '12345678',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(401);

      expect(response.body.message).toEqual('Incorrect credentials');
    });
  });

  // describe('/games [GET]', () => {
  //   let cookies: string = null;

  //   beforeAll(async () => {
  //     cookies = await login();
  //   });

  //   afterAll(() => {
  //     logout(cookies);
  //   });

  //   it('should return list of all games', async () => {
  //     await prismaClient.games.create({
  //       data: {
  //         name: 'TicTacToe',
  //         user_id: 1,
  //       },
  //     });

  //     const result = await request(app.getHttpServer())
  //       .get('/games')
  //       .set('Cookie', cookies);

  //     expect(result.body).toEqual([
  //       {
  //         id: expect.any(Number),
  //         name: 'TicTacToe',
  //         user_id: 1,
  //       },
  //     ]);
  //   });
  //   describe('without cookie jwt', () => {
  //     it('should respond 401', async () => {
  //       await request(app.getHttpServer()).get('/games').expect(401);
  //     });
  //   });
  // });

  describe('/auth/current [GET]', () => {
    let cookies: string = null;

    beforeAll(async () => {
      cookies = await login();
    });

    afterAll(() => {
      logout(cookies);
    });

    it('should return current user', async () => {
      const result = await request(app.getHttpServer())
        .get('/auth/current')
        .set('Cookie', cookies);

      const { firstname, lastname, email } = user;
      expect(result.body).toEqual({
        id: expect.any(Number),
        firstname,
        lastname,
        email,
      });
    });

    describe('without cookie jwt', () => {
      it('should respond 401', async () => {
        await request(app.getHttpServer()).get('/auth/current').expect(401);
      });
    });
  });
});
