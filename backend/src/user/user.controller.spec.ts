import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  userToCreateDto,
  userToReturn,
  userToUpdateDto,
  usersList,
} from './mocks';
import { ThrottlerModule } from '@nestjs/throttler';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot()],
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

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(userToReturn);

      const result = await controller.create(userToCreateDto);

      expect(result).toEqual(userToReturn);
    });

    it('should throw an error if email already exists', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException('E-mail já cadastrado'));

      try {
        await controller.create(userToCreateDto);
      } catch (error) {
        if (error instanceof BadRequestException) {
          expect(error.message).toBe('E-mail já cadastrado');
          expect(error.getStatus()).toBe(400);
        }
      }
    });
  });

  describe('findAll', () => {
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
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      const userId = '1';
      const expectedResponse = { message: 'Usuário excluido' };

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
          new NotFoundException(`Usuário com ID ${userId} não encontrado`),
        );

      try {
        await controller.remove(userId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          expect(error.message).toBe(`Usuário com ID ${userId} não encontrado`);
          expect(error.getStatus()).toBe(404);
        }
      }
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const userId = '1';

      jest.spyOn(service, 'update').mockResolvedValue(usersList[1]);

      const result = await controller.update(userId, userToUpdateDto);

      expect(result).toEqual(usersList[1]);
      expect(service.update).toHaveBeenCalledWith(1, userToUpdateDto);
    });

    it('should throw an error if user does not exist for update', async () => {
      const userId = '999';

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new NotFoundException(`Usuário com ID ${userId} não encontrado`),
        );

      try {
        await controller.update(userId, userToUpdateDto);
      } catch (error) {
        if (error instanceof NotFoundException) {
          expect(error.message).toBe(`Usuário com ID ${userId} não encontrado`);
          expect(error.getStatus()).toBe(404);
        }
      }
    });

    it('should throw an error if email already exists when updating user', async () => {
      const userId = '999';

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new BadRequestException('E-mail já cadastrado'));

      try {
        await controller.update(userId, userToUpdateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain('E-mail já cadastrado');
      }
    });
  });
});
