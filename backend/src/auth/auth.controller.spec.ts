import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { signInDto } from './mocks';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token for valid credentials', async () => {
      const result = { access_token: 'test_token' };

      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await authController.signIn(signInDto)).toEqual(result);
      expect(authService.signIn).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
    });

    it('should throw an UnauthorizedException for invalid credentials', async () => {
      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
