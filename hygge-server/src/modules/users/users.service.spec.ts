import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UserCreatePayload } from './users.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let findUniqueMock: jest.Mock;
  let createMock: jest.Mock;

  beforeEach(async () => {
    findUniqueMock = jest.fn();
    createMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findUnique: findUniqueMock,
              create: createMock,
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById method', () => {
    const user: Prisma.PromiseReturnType<typeof service.findById> = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
    };

    it('should return a user if id match', async () => {
      findUniqueMock.mockResolvedValue(user);
      const result = await service.findById('1');
      expect(result).toEqual(user);
    });
  });

  describe('findByEmail method', () => {
    const user: Prisma.PromiseReturnType<typeof service.findByEmail> = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      password: 'iAmAnEncryptedPassword',
    };

    it('should return a user if id match', async () => {
      findUniqueMock.mockResolvedValue(user);
      const result = await service.findByEmail('john@doe.com');
      expect(result).toEqual(user);
    });
  });

  describe('create method', () => {
    const user: UserCreatePayload = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      password: 'iAmAPassword',
    };
    const userCreated: Prisma.PromiseReturnType<typeof service.create> = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      password: 'iAmAnEncryptedPassword',
    };

    it('should return user created with its id', async () => {
      createMock.mockResolvedValue(userCreated);
      const result = await service.create(user);
      expect(result).toEqual(userCreated);
    });
  });
});
