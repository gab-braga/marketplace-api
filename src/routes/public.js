import { Router } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const publicRouter = Router();

publicRouter.get("/", (req, res) => {
  return res.status(200).json({ message: "Bem-vindo!" });
});

const PUBLIC_ATTRIBUTES = {
  id: true,
  nome: true,
  descricao: true,
  preco: true,
  desconto: true,
  precoFinal: true,
  foto: true,
  categoria: true,
  quantidade: false,
  avaliacaoMedia: true,
  avaliacaoTotal: true,
  caracteristicas: true,
  disponibilidade: false,
  avaliacao: false,
  item_carrinho: false,
  item_compra: false,
};

publicRouter.get("/public/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 60;

    const products = await prisma.produto.findMany({
      select: PUBLIC_ATTRIBUTES,
      where: { disponibilidade: 1 },
      take: limit,
    });
    res.json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

publicRouter.get("/public/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "O ID deve ser um número." });
    }

    const product = await prisma.produto.findFirst({
      select: PUBLIC_ATTRIBUTES,
      where: { id, disponibilidade: 1 },
    });
    res.json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

publicRouter.get("/public/products/category/:category", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 60;

    const { category } = req.params;

    const products = await prisma.produto.findMany({
      select: PUBLIC_ATTRIBUTES,
      where: { categoria: { contains: category }, disponibilidade: 1 },
      take: limit,
    });
    res.json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

publicRouter.get("/public/products/search/:nome", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 60;
    const { nome } = req.params;

    const products = await prisma.produto.findMany({
      select: PUBLIC_ATTRIBUTES,
      where: { nome: { contains: nome }, disponibilidade: 1 },
      take: limit,
    });
    res.json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});
