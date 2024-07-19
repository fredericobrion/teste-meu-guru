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
import { Prisma } from '@prisma/client';
import FormatTransformer from '../utils/format-transformer';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, phone, cpf } = createUserDto;

    await this.validateUserEmail(email);

    const encryptedPassword = await this.encryptPassword(password);

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: encryptedPassword,
        name,
        phone: FormatTransformer.unformatPhone(phone),
        cpf: FormatTransformer.unformatCpf(cpf),
      },
    });

    return this.toUserToReturnDto(createdUser);
  }

  async findAll(page: number, limit: number, filter: string) {
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

    const usersToReturn = users.map((u) => this.toUserToReturnDto(u));

    const totalUsers = await this.prisma.user.count({ where });

    return { total: totalUsers, page, limit, data: usersToReturn };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userInDb = await this.prisma.user.findUnique({ where: { id } });

    if (!userInDb) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.validateUserEmail(updateUserDto.email, userInDb.email);

    updateUserDto.cpf = FormatTransformer.unformatCpf(updateUserDto.cpf);
    updateUserDto.phone = FormatTransformer.unformatPhone(updateUserDto.phone);

    if (updateUserDto.password) {
      updateUserDto.password = await this.encryptPassword(
        updateUserDto.password,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.toUserToReturnDto(updatedUser);
  }

  async remove(id: number) {
    const userInDb = await this.prisma.user.findUnique({ where: { id } });

    if (!userInDb) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Usuário excluido' };
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  private async validateUserEmail(email: string, currentEmail?: string) {
    if (email !== currentEmail) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new BadRequestException('E-mail já cadastrado');
      }
    }
  }

  private async encryptPassword(password: string): Promise<string> {
    const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

    return bcrypt.hash(password, SALT_ROUNDS);
  }

  private toUserToReturnDto(user): UserToReturnDto {
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
