import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  userToCreateDto,
  createdUser,
  userToReturn,
  usersList,
  usersInDb,
  userToUpdateDto,
} from './mocks';
import { UserRepository } from '../repository/user-repository.interface';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(userRepository, 'create').mockResolvedValue(createdUser);

      const result = await service.create(userToCreateDto);

      expect(result).toEqual(userToReturn);
    });

    it('should throw an error if email already exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({
        ...userToCreateDto,
        admin: false,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.create(userToCreateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a paginated and filtered list of users', async () => {
      const page = 1;
      const limit = 2;
      const filter = 'teste';

      jest
        .spyOn(userRepository, 'findAll')
        .mockResolvedValue({ total: usersList.length, data: usersInDb });

      const result = await service.findAll(page, limit, filter);

      expect(result).toEqual({
        total: usersList.length,
        page,
        limit,
        data: usersList,
      });
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findById').mockResolvedValue(usersInDb[0]);
      jest.spyOn(userRepository, 'remove').mockResolvedValue();

      const result = await service.remove(userId);

      expect(result).toEqual({ message: 'Usuário excluido' });
    });

    it('should throw an error if user does not exist for delete', async () => {
      const userId = 999;
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const userId = 2;

      jest.spyOn(userRepository, 'findById').mockResolvedValue(usersInDb[1]);

      jest.spyOn(userRepository, 'update').mockResolvedValue(usersInDb[1]);

      const result = await service.update(userId, userToUpdateDto);

      expect(result).toEqual(usersList[1]);
    });

    it('should throw an error if user does not exist for update', async () => {
      const userId = 999;

      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(service.update(userId, userToUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if email already exists when updating user', async () => {
      const userId = 999;

      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({
        ...usersInDb[0],
      });

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({
        ...usersInDb[1],
        password: 'senha',
      });

      await expect(service.update(userId, userToUpdateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validateUserEmail', () => {
    it('should throw an error if email already exists and is different from current email', async () => {
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue({ ...createdUser, password: 'senha' });

      await expect(
        service['validateUserEmail'](createdUser.email, 'teste@email.com'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should not throw an error if email does not exist', async () => {
      const email = 'teste@email.com';
      const currentEmail = 'another@email.com';
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      await expect(
        service['validateUserEmail'](email, currentEmail),
      ).resolves.not.toThrow();
    });

    it('should not throw an error if email is the same as the current email', async () => {
      const email = 'teste@email.com';
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      await expect(service['validateUserEmail'](email)).resolves.not.toThrow();
    });
  });
});
