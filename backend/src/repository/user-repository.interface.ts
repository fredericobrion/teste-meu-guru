import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  UserToReturnDto,
  UserToReturnWithPasswordDto,
} from '../user/dto/created-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

export interface UserRepository {
  create(data: CreateUserDto): Promise<UserToReturnDto>;
  findAll(
    page: number,
    limit: number,
    filter: string,
  ): Promise<{ total: number; data: UserToReturnDto[] }>;
  findById(id: number): Promise<UserToReturnDto | null>;
  update(id: number, data: UpdateUserDto): Promise<UserToReturnDto>;
  remove(id: number): Promise<void>;
  findByEmail(email: string): Promise<UserToReturnWithPasswordDto | null>;
}
