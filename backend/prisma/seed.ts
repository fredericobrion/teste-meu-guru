import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 10;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      password: await bcrypt.hash(ADMIN_PASSWORD, +SALT_ROUNDS),
      name: 'Admin',
      phone: '00000000000',
      cpf: '00000000000',
      admin: true,
    },
  });
  console.log({ admin });

  const users = [
    {
      email: 'joao.silva@example.com',
      name: 'João Silva',
      phone: '11111111111',
      cpf: '11111111111',
    },
    {
      email: 'maria.souza@example.com',
      name: 'Maria Souza',
      phone: '22222222222',
      cpf: '22222222222',
    },
    {
      email: 'carlos.santos@example.com',
      name: 'Carlos Santos',
      phone: '33333333333',
      cpf: '33333333333',
    },
    {
      email: 'ana.lima@example.com',
      name: 'Ana Lima',
      phone: '44444444444',
      cpf: '44444444444',
    },
    {
      email: 'paulo.almeida@example.com',
      name: 'Paulo Almeida',
      phone: '55555555555',
      cpf: '55555555555',
    },
    {
      email: 'fernanda.oliveira@example.com',
      name: 'Fernanda Oliveira',
      phone: '66666666666',
      cpf: '66666666666',
    },
    {
      email: 'ricardo.pereira@example.com',
      name: 'Ricardo Pereira',
      phone: '77777777777',
      cpf: '77777777777',
    },
    {
      email: 'juliana.rocha@example.com',
      name: 'Juliana Rocha',
      phone: '88888888888',
      cpf: '88888888888',
    },
    {
      email: 'roberto.mendes@example.com',
      name: 'Roberto Mendes',
      phone: '99999999999',
      cpf: '99999999999',
    },
    {
      email: 'lucas.fernandes@example.com',
      name: 'Lucas Fernandes',
      phone: '10101010101',
      cpf: '10101010101',
    },
    {
      email: 'camila.gomes@example.com',
      name: 'Camila Gomes',
      phone: '12121212121',
      cpf: '12121212121',
    },
    {
      email: 'marcos.martins@example.com',
      name: 'Marcos Martins',
      phone: '13131313131',
      cpf: '13131313131',
    },
    {
      email: 'patricia.barros@example.com',
      name: 'Patricia Barros',
      phone: '14141414141',
      cpf: '14141414141',
    },
    {
      email: 'daniel.costa@example.com',
      name: 'Daniel Costa',
      phone: '15151515151',
      cpf: '15151515151',
    },
    {
      email: 'carla.ribeiro@example.com',
      name: 'Carla Ribeiro',
      phone: '16161616161',
      cpf: '16161616161',
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash('password', +SALT_ROUNDS);
    await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        admin: false,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
