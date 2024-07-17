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
