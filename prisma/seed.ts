// prisma/seed.ts

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gmail.com';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('⚠️ Admin already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash('123', 10);

  await prisma.user.create({
    data: {
      username: 'admin',
      email: adminEmail,
      phone: '1234567890',
      password: hashedPassword,
      role: UserRole.ADMIN,
      address: 'Admin Address',
    },
  });

  console.log('✅ Admin user created.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
