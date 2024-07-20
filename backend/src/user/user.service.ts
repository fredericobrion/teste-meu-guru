import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserToReturnDto,
  UserToReturnWithPasswordDto,
} from './dto/created-user.dto';
import * as bcrypt from 'bcrypt';
import FormatTransformer from '../utils/format-transformer';
import { UserRepository } from '../repository/user-repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserToReturnDto> {
    const { email, password, name, phone, cpf } = createUserDto;

    const userInDb = await this.userRepository.findByEmail(email);

    if (userInDb) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const encryptedPassword = await this.encryptPassword(password);

    const createdUser = await this.userRepository.create({
      email,
      password: encryptedPassword,
      name,
      phone: FormatTransformer.unformatPhone(phone),
      cpf: FormatTransformer.unformatCpf(cpf),
    });

    return {
      ...createdUser,
      cpf: FormatTransformer.formatCpf(createdUser.cpf),
      phone: FormatTransformer.formatPhone(createdUser.phone),
    };
  }

  async findAll(
    page: number,
    limit: number,
    filter: string,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    data: UserToReturnDto[];
  }> {
    const usersInDb = await this.userRepository.findAll(page, limit, filter);

    const usersToReturn = usersInDb.data.map((u) => ({
      ...u,
      cpf: FormatTransformer.formatCpf(u.cpf),
      phone: FormatTransformer.formatPhone(u.phone),
    }));

    return { total: usersInDb.total, page, limit, data: usersToReturn };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserToReturnDto> {
    const userInDb = await this.userRepository.findById(id);

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

    const updatedUser = await this.userRepository.update(id, updateUserDto);

    updatedUser.cpf = FormatTransformer.formatCpf(updatedUser.cpf);
    updatedUser.phone = FormatTransformer.formatPhone(updatedUser.phone);

    return updatedUser;
  }

  async remove(id: number): Promise<{ message: string }> {
    const userInDb = await this.userRepository.findById(id);

    if (!userInDb) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.userRepository.remove(id);

    return { message: 'Usuário excluido' };
  }

  async findByEmail(
    email: string,
  ): Promise<UserToReturnWithPasswordDto | null> {
    const user = await this.userRepository.findByEmail(email);

    return user;
  }

  private async validateUserEmail(
    email: string,
    currentEmail?: string,
  ): Promise<void> {
    if (email !== currentEmail) {
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        throw new BadRequestException('E-mail já cadastrado');
      }
    }
  }

  private async encryptPassword(password: string): Promise<string> {
    const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

    return bcrypt.hash(password, SALT_ROUNDS);
  }
}
