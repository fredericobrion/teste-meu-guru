import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreatedUserDto } from './dto/created-user.dto';

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

    const userToReturn = new CreatedUserDto();
    userToReturn.id = createdUser.id;
    userToReturn.email = createdUser.email;
    userToReturn.name = createdUser.name;
    userToReturn.phone = createdUser.phone;
    userToReturn.createdAt = createdUser.createdAt;
    userToReturn.updatedAt = createdUser.updatedAt;

    return userToReturn;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
