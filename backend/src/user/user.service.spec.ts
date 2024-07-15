import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../module/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { userDto, createdUser, userToReturn, usersList } from './mocks';

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

  it('should create a new user', async () => {
    jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

    const result = await service.create(userDto);

    prismaService.user.create = jest.fn().mockResolvedValue(createdUser);

    expect(result).toEqual(userToReturn);
  });

  it('should throw an error if email already exists', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
      ...userDto,
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.create(userDto)).rejects.toThrow(BadRequestException);
  });

  it('should return all users', async () => {
    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(usersList);

    const result = await service.findAll();

    expect(result).toEqual(usersList);
  });
});
