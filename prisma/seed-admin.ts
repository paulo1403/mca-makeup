import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Creando usuario administrador...");

  // Leer variables de entorno
  const adminEmail = process.env.ADMIN_EMAIL || "admin@marcelacorderomakeup.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Marcela Cordero";

  console.log(`📧 Email: ${adminEmail}`);
  console.log(`👤 Nombre: ${adminName}`);
  console.log(`🔑 Password: ${"*".repeat(adminPassword.length)}`);

  try {
    // Verificar si ya existe un usuario con este email
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log("⚠️  Usuario admin ya existe. Actualizando password...");

      // Hash de la nueva password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      // Actualizar usuario existente
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          name: adminName,
        },
      });

      console.log("✅ Usuario admin actualizado exitosamente!");
      console.log(`   ID: ${updatedUser.id}`);
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Nombre: ${updatedUser.name}`);
    } else {
      console.log("🆕 Creando nuevo usuario admin...");

      // Hash de la password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      // Crear nuevo usuario admin
      const newUser = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: "ADMIN",
        },
      });

      console.log("✅ Usuario admin creado exitosamente!");
      console.log(`   ID: ${newUser.id}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Nombre: ${newUser.name}`);
      console.log(`   Role: ${newUser.role}`);
    }

    console.log("\n🎉 ¡Listo! Puedes hacer login con estas credenciales:");
    console.log(`   📧 Email: ${adminEmail}`);
    console.log(`   🔑 Password: ${adminPassword}`);
    console.log("\n💡 Para cambiar las credenciales, modifica las variables de entorno:");
    console.log("   ADMIN_EMAIL=tu-email@ejemplo.com");
    console.log("   ADMIN_PASSWORD=tu-password-segura");
    console.log('   ADMIN_NAME="Tu Nombre Completo"');
  } catch (error) {
    console.error("❌ Error al crear/actualizar usuario admin:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        console.error("💡 Parece que ya existe un usuario con este email.");
      } else {
        console.error("💡 Verifica que la base de datos esté configurada correctamente.");
      }
    }

    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error fatal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
