import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { UserResponseDto } from '../users/users.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            users: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHashedPassword function', () => {
    it('should have called bcrypt hashSync function', () => {
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPwd');
      expect(service.getHashedPassword('password')).toBe('hashedPwd');
    });
  });

  describe('getCurrentUser function', () => {
    it('should throw unauthorized exception if nullish token', () => {
      const result = service.getCurrentUser(null);
      expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw unauthorized exception decoded token does not have sub attribute', () => {
      jest.spyOn(jwtService, 'decode').mockReturnValue({});
      const result = service.getCurrentUser('iamatoken');
      expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should ', async () => {
      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 });
      jest.spyOn(usersService, 'findById').mockResolvedValue(null);
      const result = await service.getCurrentUser('iamatoken');
      expect(result).toBeNull();
    });
  });

  describe('signJwt function', () => {
    const userResponseDto: UserResponseDto = {
      id: '1',
      firstname: 'a',
      lastname: 'b',
      email: 'a@b',
    };

    it('should return a signed token', async () => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('signedtoken');
      const result = await service.signJwt(userResponseDto);
      expect(result).toBe('signedtoken');
    });
  });

  describe('validateUser function', () => {
    const user: Prisma.PromiseReturnType<typeof usersService.findByEmail> = {
      id: '1',
      firstname: 'a',
      lastname: 'b',
      email: 'a@b',
      password: 'password',
    };

    it('should throw unauthorized exception if no user found in db', () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      const result = service.validateUser(user.email, user.password);
      expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw unauthorized exception if password matching fails', () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      const result = service.validateUser(user.email, user.password);
      expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should return user without password', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      const result = await service.validateUser(user.email, user.password);
      expect(result.id).toBe(1);
      expect(result.email).toBe('a@b');
      expect(result.firstname).toBe('a');
      expect(result.lastname).toBe('b');
      expect(result['password']).toBeUndefined();
    });
  });
});
