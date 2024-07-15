import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { userDto, userToReturn, usersList } from './mocks';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(userToReturn);

    const result = await controller.create(userDto);

    expect(result).toEqual(userToReturn);
  });

  it('should throw an error if email already exists', async () => {
    jest
      .spyOn(service, 'create')
      .mockRejectedValue(new BadRequestException('User already exists'));

    try {
      await controller.create(userDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        expect(error.message).toBe('User already exists');
        expect(error.getStatus()).toBe(400);
      }
    }
  });

  it('should return all users', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue(usersList);

    const result = await controller.findAll();

    expect(result).toEqual(usersList);
  });
});
