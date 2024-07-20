export class UserToReturnDto {
  id: number;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserToReturnWithPasswordDto {
  id: number;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  admin: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
