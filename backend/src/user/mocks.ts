import { User } from '@prisma/client';

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

export { userDto, createdUser };
