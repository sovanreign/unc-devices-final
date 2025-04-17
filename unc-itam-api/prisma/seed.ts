import { PrismaClient } from '@prisma/client';
import { passwordEncryption } from '../src/lib/password-encryption.util';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@unc.edu.ph' },
    update: {},
    create: {
      email: 'admin@unc.edu.ph',
      name: 'Admin Account',
      password: await passwordEncryption('admin123'),
      role: 'Admin',
      employeeId: '000000',
    },
  });

  console.log('Admin account created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
