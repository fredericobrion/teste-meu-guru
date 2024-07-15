import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../module/prisma/prisma.service';
import { User } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

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
    const userDto = {
      email: 'teste@email.com',
      password: '123456',
      name: 'teste',
      phone: '(32) 99167-4479',
    };

    const createdUser: User = {
      id: 1,
      ...userDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

    const result = await service.create(userDto);

    prismaService.user.create = jest.fn().mockResolvedValue(createdUser);

    expect(result).toEqual(createdUser);
  });

  it('should throw an error if email already exists', async () => {
    const userDto = {
      email: 'teste@email.com',
      password: '123456',
      name: 'teste',
      phone: '(32) 99167-4479',
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
      ...userDto,
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.create(userDto)).rejects.toThrow(BadRequestException);
  });
});
