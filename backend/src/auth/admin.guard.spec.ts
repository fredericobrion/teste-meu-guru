import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard } from './admin.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('AdminGuard', () => {
  let adminGuard: AdminGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminGuard,
        Reflector,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    adminGuard = module.get<AdminGuard>(AdminGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(adminGuard).toBeDefined();
  });

  it('should allow access if admin requirement is not set', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: {} }),
      }),
      getHandler: () => {},
      getClass: () => {},
    } as unknown as ExecutionContext;

    expect(adminGuard.canActivate(mockContext)).toBe(true);
  });

  it('should allow access if user is admin', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const mockRequest = {
      user: {
        admin: true,
      },
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => {},
      getClass: () => {},
    } as unknown as ExecutionContext;

    expect(adminGuard.canActivate(mockContext)).toBe(true);
  });

  it('should deny access if user is not admin', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const mockRequest = {
      user: {
        admin: false,
      },
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => {},
      getClass: () => {},
    } as unknown as ExecutionContext;

    expect(adminGuard.canActivate(mockContext)).toBe(false);
  });
});
