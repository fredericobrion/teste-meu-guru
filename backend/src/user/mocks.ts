import { UserToReturnDto } from './dto/created-user.dto';

const FORMATED_CPF = '111.222.333-44';
const UNFORMATED_CPF = '11122233344';
const FORMATED_PHONE = '(31) 99157-4879';
const UNFORMATED_PHONE = '31991574879';
const ANA_EMAL = 'ana@email.com';
const MARIA_EMAIL = 'maria@email.com';

const userToCreateDto = {
  email: ANA_EMAL,
  password: '123456',
  name: 'ana',
  phone: FORMATED_PHONE,
  cpf: FORMATED_CPF,
};

const userToUpdateDto = {
  email: MARIA_EMAIL,
  name: 'maria',
  phone: FORMATED_PHONE,
  cpf: FORMATED_CPF,
};

const createdUser = {
  id: 1,
  email: ANA_EMAL,
  name: 'ana',
  phone: UNFORMATED_PHONE,
  cpf: UNFORMATED_CPF,
  admin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const userToReturn: UserToReturnDto = {
  id: 1,
  email: userToCreateDto.email,
  name: userToCreateDto.name,
  phone: FORMATED_PHONE,
  cpf: FORMATED_CPF,
  admin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const secondUser: UserToReturnDto = {
  id: 2,
  email: MARIA_EMAIL,
  name: 'maria',
  phone: FORMATED_PHONE,
  cpf: FORMATED_CPF,
  admin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const usersInDb = [
  {
    ...userToReturn,
    phone: UNFORMATED_PHONE,
    cpf: UNFORMATED_CPF,
  },
  {
    ...secondUser,
    phone: UNFORMATED_PHONE,
    cpf: UNFORMATED_CPF,
  },
];

const usersList = [
  { ...userToReturn },
  {
    id: 2,
    email: MARIA_EMAIL,
    name: 'maria',
    phone: FORMATED_PHONE,
    cpf: FORMATED_CPF,
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
