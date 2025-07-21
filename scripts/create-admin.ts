import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'marcelacordero.bookings@gmail.com' },
    });

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('marcela21@', 12);

    // Create admin user
    await prisma.user.create({
      data: {
        email: 'marcelacordero.bookings@gmail.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully:');
    console.log('Email: marcelacordero.bookings@gmail.com');
    console.log('Password: marcela21@');
    console.log('Please change the password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
