import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../module/prisma/prisma.service';
import { UserToReturnDto } from './dto/created-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, phone } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password,
        name,
        phone,
      },
    });

    const userToReturn = new UserToReturnDto();
    userToReturn.id = createdUser.id;
    userToReturn.email = createdUser.email;
    userToReturn.name = createdUser.name;
    userToReturn.phone = createdUser.phone;
    userToReturn.createdAt = createdUser.createdAt;
    userToReturn.updatedAt = createdUser.updatedAt;

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
      return userToReturn;
    });

    const totalUsers = await this.prisma.user.count({ where });

    return { total: totalUsers, page, limit, data: usersToReturn };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
