import { Router } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const authRouter = Router();

authRouter.post("/auth/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome) {
      return res.status(400).json({ message: "O nome é obrigatório." });
    }
    if (!email) {
      return res.status(400).json({ message: "O e-mail é obrigatório." });
    }
    if (!senha) {
      return res.status(400).json({ message: "A senha é obrigatória." });
    }

    const userExists = await prisma.usuario.findFirst({ where: { email } });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Este e-mail já está sendo utilizado." });
    }

    const passwordHash = await bcrypt.hash(senha, 12);

    await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: passwordHash,
      },
    });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

// Rota aberta
authRouter.post("/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email) {
      return res.status(400).json({ message: "O e-mail é obrigatório." });
    }
    if (!senha) {
      return res.status(400).json({ message: "A senha é obrigatória." });
    }

    const user = await prisma.usuario.findFirst({
      where: { email, habilitado: 1 },
    });

    if (!user) {
      return res.status(404).json({ message: "E-mail não cadastrado." });
    }

    const isSamePassword = bcrypt.compareSync(senha, user.senha);

    if (isSamePassword) {
      const payload = { id: user.id, email: user.email, role: user.role };
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, { expiresIn: "7d" });
      return res.status(200).json({ authType: "Bearer", token });
    }

    return res.status(401).json({ message: "Senha inválida." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});
