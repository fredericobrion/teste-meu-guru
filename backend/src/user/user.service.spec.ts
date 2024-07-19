import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../module/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  userToCreateDto,
  createdUser,
  userToReturn,
  usersList,
  usersInDb,
  userToUpdateDto,
} from './mocks';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

      const result = await service.create(userToCreateDto);

      expect(result).toEqual(userToReturn);
    });

    it('should throw an error if email already exists', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
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

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(usersInDb);
      jest
        .spyOn(prismaService.user, 'count')
        .mockResolvedValue(usersList.length);

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
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(usersInDb[0]);
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(usersInDb[0]);

      const result = await service.remove(userId);

      expect(result).toEqual({ message: 'Usuário excluido' });
    });

    it('should throw an error if user does not exist for delete', async () => {
      const userId = 999;
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const userId = 2;

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(usersInDb[1]);

      jest.spyOn(prismaService.user, 'update').mockResolvedValue(usersInDb[1]);

      const result = await service.update(userId, userToUpdateDto);

      expect(result).toEqual(usersList[1]);
    });

    it('should throw an error if user does not exist for update', async () => {
      const userId = 999;

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.update(userId, userToUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if email already exists when updating user', async () => {
      const userId = 999;

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        ...usersInDb[0],
      });

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        ...usersInDb[1],
      });

      await expect(service.update(userId, userToUpdateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
