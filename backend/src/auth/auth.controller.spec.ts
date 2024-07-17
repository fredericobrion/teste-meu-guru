import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../module/prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        Reflector,
        AuthGuard,
        JwtService,
        UserService,
        AuthService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
