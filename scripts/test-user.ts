import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testUser() {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'admin@marcelacordero.com' },
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('ID:', user.id);

    // Test password
    const isPasswordValid = await bcrypt.compare('admin123', user.password);
    console.log('Password test:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUser();
