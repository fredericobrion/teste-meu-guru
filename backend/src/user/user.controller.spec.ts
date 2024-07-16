import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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
            findAll: jest.fn(),
            remove: jest.fn(),
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

  it('should return a paginated and filtered list of users', async () => {
    const page = '1';
    const limit = '2';
    const filter = 'teste';

    const paginatedUsers = {
      total: usersList.length,
      page: Number(page),
      limit: Number(limit),
      data: usersList,
    };

    jest.spyOn(service, 'findAll').mockResolvedValue(paginatedUsers);

    const result = await controller.findAll(page, limit, filter);

    expect(result).toEqual(paginatedUsers);
  });

  it('should delete a user by Id', async () => {
    const userId = '1';
    const expectedResponse = { message: 'User deleted' };

    jest.spyOn(service, 'remove').mockResolvedValue(expectedResponse);

    const result = await controller.remove(userId);

    expect(result).toEqual(expectedResponse);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should throw an error if user dows not exist', async () => {
    const userId = '999';
    jest
      .spyOn(service, 'remove')
      .mockRejectedValue(
        new NotFoundException(`User with ID ${userId} not found`),
      );

    try {
      await controller.remove(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        expect(error.message).toBe(`User with ID ${userId} not found`);
        expect(error.getStatus()).toBe(404);
      }
    }
  });
});
