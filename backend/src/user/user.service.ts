import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../module/prisma/prisma.service';
import { UserToReturnDto } from './dto/created-user.dto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 10;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, phone, cpf } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const encryptedPassword = await bcrypt.hash(password, +SALT_ROUNDS);

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: encryptedPassword,
        name,
        phone,
        cpf,
      },
    });

    const userToReturn = new UserToReturnDto();
    userToReturn.id = createdUser.id;
    userToReturn.email = createdUser.email;
    userToReturn.name = createdUser.name;
    userToReturn.phone = createdUser.phone;
    userToReturn.createdAt = createdUser.createdAt;
    userToReturn.updatedAt = createdUser.updatedAt;
    userToReturn.cpf = createdUser.cpf;
    userToReturn.admin = createdUser.admin;

    return userToReturn;
  }

  async findAll(page: number, limit: number, filter: string) {
    const skip = (page - 1) * limit;
    const where = filter
      ? {
          OR: [{ name: { contains: filter } }, { email: { contains: filter } }],
        }
      : {};
    const users = await this.prisma.user.findMany({ where, skip, take: limit });

    const usersToReturn = users.map((user) => {
      const userToReturn = new UserToReturnDto();
      userToReturn.id = user.id;
      userToReturn.email = user.email;
      userToReturn.name = user.name;
      userToReturn.phone = user.phone;
      userToReturn.createdAt = user.createdAt;
      userToReturn.updatedAt = user.updatedAt;
      userToReturn.cpf = user.cpf;
      userToReturn.admin = user.admin;
      return userToReturn;
    });

    const totalUsers = await this.prisma.user.count({ where });

    return { total: totalUsers, page, limit, data: usersToReturn };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userInDb = await this.prisma.user.findUnique({ where: { id } });

    if (!userInDb) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== userInDb.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        +SALT_ROUNDS,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    const userToReturn = new UserToReturnDto();
    userToReturn.id = updatedUser.id;
    userToReturn.email = updatedUser.email;
    userToReturn.name = updatedUser.name;
    userToReturn.phone = updatedUser.phone;
    userToReturn.createdAt = updatedUser.createdAt;
    userToReturn.updatedAt = updatedUser.updatedAt;
    userToReturn.cpf = updatedUser.cpf;
    userToReturn.admin = updatedUser.admin;

    return userToReturn;
  }

  async remove(id: number) {
    const userInDb = await this.prisma.user.findUnique({ where: { id } });

    if (!userInDb) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'User deleted' };
  }
}
