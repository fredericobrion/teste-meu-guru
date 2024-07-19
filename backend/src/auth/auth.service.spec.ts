import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from '../module/prisma/prisma.service';
// import { Reflector } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { userInDb, SALT_ROUNDS } from './mocks';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token for valid credentials', async () => {
      const encryptedPassword = await bcrypt.hash(
        userInDb.password,
        +SALT_ROUNDS,
      );

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValue({ ...userInDb, password: encryptedPassword });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('test_token');

      const result = await authService.signIn(
        userInDb.email,
        userInDb.password,
      );

      expect(result).toEqual({ access_token: 'test_token' });
      expect(userService.findByEmail).toHaveBeenCalledWith(userInDb.email);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: userInDb.id,
        name: userInDb.name,
        admin: userInDb.admin,
      });
    });

    it('should throw an UnauthorizedException for invalid password', async () => {
      const encryptedPassword = await bcrypt.hash(
        userInDb.password,
        +SALT_ROUNDS,
      );

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValue({ ...userInDb, password: encryptedPassword });

      await expect(
        authService.signIn(userInDb.email, 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException for non-existent user', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      await expect(
        authService.signIn(userInDb.email, userInDb.password),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
