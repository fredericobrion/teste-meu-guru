import { SignInDto } from './dto/signin-dto';

export const SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 10;

export const userInDb = {
  id: 1,
  password: 'hashedPassword',
  email: 'maria@email.com',
  name: 'Maria',
  phone: '31991574879',
  cpf: '11122233344',
  admin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const signInDto: SignInDto = {
  email: 'maria@email.com',
  password: 'password',
};
