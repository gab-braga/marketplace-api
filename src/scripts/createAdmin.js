import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

(async () => {
  const userExists = await prisma.usuario.findFirst({
    where: { email: process.env.ADMIN_EMAIL },
  });

  if (!userExists) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    await prisma.usuario.create({
      data: {
        nome: "Admin Default",
        email: process.env.ADMIN_EMAIL,
        senha: passwordHash,
        role: "admin",
      },
    });

    console.log("Admin user created.");
  }
})();
