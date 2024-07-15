import { CreatedUserDto } from './dto/created-user.dto';

const userDto = {
  email: 'teste@email.com',
  password: '123456',
  name: 'teste',
  phone: '(32) 99167-4479',
};

const createdUser: CreatedUserDto = {
  id: 1,
  email: userDto.email,
  name: userDto.name,
  phone: userDto.phone,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export { userDto, createdUser };
