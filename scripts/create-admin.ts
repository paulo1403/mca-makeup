import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@marcelacordero.com' },
    });

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@marcelacordero.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@marcelacordero.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
