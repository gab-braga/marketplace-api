import { Router } from "express";
import { hasRole } from "../middlewares/hasRole.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const adminRouter = Router();

// users

adminRouter.get("/admin/users", hasRole("admin"), async (req, res) => {
  const users = await prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      cpf: true,
      foto: true,
      telefone: true,
      dataNascimento: true,
      habilitado: true,
      senha: false,
    },
  });
  res.json(users);
});

adminRouter.get("/admin/users/:id", hasRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.usuario.findFirst({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        cpf: true,
        foto: true,
        telefone: true,
        dataNascimento: true,
        senha: false,
      },
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

adminRouter.put(
  "/admin/users/:id/enable",
  hasRole("admin"),
  async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const user = await prisma.usuario.update({
        where: { id },
        data: { habilitado: 1 },
      });
      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

adminRouter.put(
  "/admin/users/:id/disable",
  hasRole("admin"),
  async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const user = await prisma.usuario.update({
        where: { id },
        data: { habilitado: 0 },
      });
      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

// products

adminRouter.get("/admin/products", hasRole("admin"), async (req, res) => {
  try {
    const products = await prisma.produto.findMany({
      select: {
        id: true,
        nome: true,
        descricao: true,
        preco: true,
        desconto: true,
        foto: true,
        categoria: true,
        quantidade: true,
        avaliacaoMedia: true,
        avaliacaoTotal: true,
        caracteristicas: true,
        disponibilidade: true,
        precoFinal: true,
        avaliacao: false,
        item_carrinho: false,
        item_compra: false,
      },
    });
    res.json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

adminRouter.get("/admin/products/:id", hasRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await prisma.produto.findFirst({
      where: { id },
      select: {
        id: true,
        nome: true,
        descricao: true,
        preco: true,
        desconto: true,
        foto: true,
        categoria: true,
        quantidade: true,
        avaliacaoMedia: true,
        avaliacaoTotal: true,
        caracteristicas: true,
        disponibilidade: true,
        precoFinal: true,
        avaliacao: false,
        item_carrinho: false,
        item_compra: false,
      },
    });
    res.json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

adminRouter.post("/admin/products", hasRole("admin"), async (req, res) => {
  const {
    nome,
    descricao,
    preco,
    foto,
    categoria,
    quantidade,
    caracteristicas,
  } = req.body;
  try {
    const product = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco) || 0.0,
        precoFinal: parseFloat(preco) || 0.0,
        foto,
        categoria,
        quantidade: parseInt(quantidade) || 0,
        caracteristicas,
      },
    });
    res.json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

adminRouter.put("/admin/products/:id", hasRole("admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      nome,
      descricao,
      preco,
      desconto,
      foto,
      categoria,
      quantidade,
      caracteristicas,
    } = req.body;

    const product = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        descricao,
        preco: parseFloat(preco) || 0.0,
        precoFinal: parseFloat(preco) || 0.0,
        desconto: parseFloat(desconto) || 0.0,
        foto,
        categoria,
        quantidade: parseInt(quantidade) || 0,
        caracteristicas,
      },
    });
    res.json(product);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

// purchases

adminRouter.get("/admin/purchases", hasRole("admin"), async (req, res) => {
  try {
    const purchases = await prisma.compra.findMany({
      include: { usuario: true },
    });
    res.json(purchases);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

adminRouter.get("/admin/purchases/:id", hasRole("admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const purchase = await prisma.compra.findFirst({
      where: { id },
      include: { usuario: true },
    });
    res.json(purchase);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

adminRouter.get(
  "/admin/purchases/:id/items",
  hasRole("admin"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const items = await prisma.item_compra.findMany({
        where: { compra_id: id },
        include: { produto: true },
      });
      res.json(items);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

adminRouter.put(
  "/admin/purchases/:id/status",
  hasRole("admin"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { statusCompra } = req.body;
      const purchase = await prisma.compra.update({
        where: { id },
        data: {
          statusCompra,
        },
      });
      res.json(purchase);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);
