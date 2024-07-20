import { Injectable } from '@nestjs/common';
import { PrismaService } from '../module/prisma/prisma.service';
import { UserRepository } from './user-repository.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import {
  UserToReturnDto,
  UserToReturnWithPasswordDto,
} from '../user/dto/created-user.dto';
import { Prisma, User } from '@prisma/client';
import FormatTransformer from '../utils/format-transformer';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserToReturnDto> {
    const createdUser = await this.prisma.user.create({
      data,
    });

    return this.toUserToReturnDto(createdUser);
  }

  async findAll(
    page: number,
    limit: number,
    filter: string,
  ): Promise<{ total: number; data: UserToReturnDto[] }> {
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {
      AND: [
        filter
          ? {
              OR: [
                { name: { contains: filter, mode: 'insensitive' } },
                { email: { contains: filter, mode: 'insensitive' } },
              ],
            }
          : {},
        { email: { not: 'admin@admin.com' } },
      ],
    };

    const users = await this.prisma.user.findMany({ where, skip, take: limit });
    const totalUsers = await this.prisma.user.count({ where });

    return { total: totalUsers, data: users.map(this.toUserToReturnDto) };
  }

  async findById(id: number): Promise<UserToReturnDto | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toUserToReturnDto(user) : null;
  }

  async update(id: number, data: UpdateUserDto): Promise<UserToReturnDto> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.toUserToReturnDto(updatedUser);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(
    email: string,
  ): Promise<UserToReturnWithPasswordDto | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  private toUserToReturnDto(user: User): UserToReturnDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: FormatTransformer.formatPhone(user.phone),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      cpf: FormatTransformer.formatCpf(user.cpf),
      admin: user.admin,
    };
  }
}
