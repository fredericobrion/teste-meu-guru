import { UserToReturnDto } from './dto/created-user.dto';

const userToCreateDto = {
  email: 'ana@email.com',
  password: '123456',
  name: 'ana',
  phone: '(32) 99167-4479',
  cpf: '111.222.333-44',
};

const userToUpdateDto = {
  email: 'maria@email.com',
  name: 'maria',
  phone: '(32) 99167-4479',
  cpf: '111.222.333-44',
};

const createdUser = {
  id: 1,
  ...userToCreateDto,
  admin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const userToReturn: UserToReturnDto = {
  id: 1,
  email: userToCreateDto.email,
  name: userToCreateDto.name,
  phone: userToCreateDto.phone,
  cpf: userToCreateDto.cpf,
  admin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const secondUser: UserToReturnDto = {
  id: 2,
  email: 'joao@gmail.comm',
  name: 'joao',
  phone: '(11) 9955-8899',
  cpf: '111.222.333-44',
  admin: false,
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
    cpf: '111.222.333-44',
    admin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export {
  userToCreateDto,
  createdUser,
  userToReturn,
  usersList,
  usersInDb,
  userToUpdateDto,
};
