import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { userToCreateDto, userToReturn, usersList } from './mocks';

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
            update: jest.fn(),
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

    const result = await controller.create(userToCreateDto);

    expect(result).toEqual(userToReturn);
  });

  it('should throw an error if email already exists', async () => {
    jest
      .spyOn(service, 'create')
      .mockRejectedValue(new BadRequestException('User already exists'));

    try {
      await controller.create(userToCreateDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        expect(error.message).toBe('User already exists');
        expect(error.getStatus()).toBe(400);
      }
    }
  });

  it('should throw an error for invalid email when creating user', async () => {
    const invalidUser = {
      ...userToCreateDto,
      email: 'invalid-email.com',
    };

    try {
      await controller.create(invalidUser);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toContain('Invalid email address');
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

  it('should delete a user by ID', async () => {
    const userId = '1';
    const expectedResponse = { message: 'User deleted' };

    jest.spyOn(service, 'remove').mockResolvedValue(expectedResponse);

    const result = await controller.remove(userId);

    expect(result).toEqual(expectedResponse);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should throw an error if user does not exist for delete', async () => {
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

  it('should update a user by ID', async () => {
    const userId = '1';
    const updateUserDto = { name: 'new name' };
    const updatedUser = {
      ...usersList[0],
      ...updateUserDto,
    };

    jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

    const result = await controller.update(userId, updateUserDto);

    expect(result).toEqual(updatedUser);
    expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
  });

  it('should throw an error if user does not exist for update', async () => {
    const userId = '999';
    const updateUserDto = { name: 'new name' };

    jest
      .spyOn(service, 'update')
      .mockRejectedValue(
        new NotFoundException(`User with ID ${userId} not found`),
      );

    try {
      await controller.update(userId, updateUserDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        expect(error.message).toBe(`User with ID ${userId} not found`);
        expect(error.getStatus()).toBe(404);
      }
    }
  });

  it('should throw an error for invalid email when updating user', async () => {
    const userId = '999';
    const invalidUser = {
      email: 'invalid-email.com',
    };

    try {
      await controller.update(userId, invalidUser);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toContain('Invalid email address');
    }
  });
});
