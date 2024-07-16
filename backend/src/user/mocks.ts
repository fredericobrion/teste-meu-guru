import { UserToReturnDto } from './dto/created-user.dto';

const userToCreateDto = {
  email: 'ana@email.com',
  password: '123456',
  name: 'ana',
  phone: '(32) 99167-4479',
};

const createdUser = {
  id: 1,
  ...userToCreateDto,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const userToReturn: UserToReturnDto = {
  id: 1,
  email: userToCreateDto.email,
  name: userToCreateDto.name,
  phone: userToCreateDto.phone,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const secondUser: UserToReturnDto = {
  id: 2,
  email: 'joao@gmail.comm',
  name: 'joao',
  phone: '(11) 9955-8899',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const usersInDb = [
  { ...userToReturn, password: userToCreateDto.password },
  { ...secondUser, password: userToCreateDto.password },
];

const usersList = [
  { ...userToReturn },
  {
    id: 2,
    email: 'joao@gmail.comm',
    name: 'joao',
    phone: '(11) 9955-8899',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export { userToCreateDto, createdUser, userToReturn, usersList, usersInDb };
