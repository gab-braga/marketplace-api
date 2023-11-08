import { Router } from "express";
import { hasRole } from "../middlewares/hasRole.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from "bcrypt";

export const clientRouter = Router();

clientRouter.get("/client/profile/:id", hasRole("client"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "O ID deve ser um número." });
      return;
    }
    const user = await prisma.usuario.findFirst({
      select: {
        id: true,
        nome: true,
        email: true,
        role: false,
        cpf: true,
        foto: true,
        telefone: true,
        dataNascimento: true,
        habilitado: true,
        senha: false,
        endereco: false,
      },
      where: { id },
    });
    return res.json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

clientRouter.get(
  "/client/profile/:id/address",
  hasRole("client"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "O ID deve ser um número." });
        return;
      }
      const address = await prisma.endereco.findFirst({
        select: {
          id: false,
          logradouro: true,
          numero: true,
          cidade: true,
          uf: true,
          cep: true,
          complemento: true,
          usuario_id: false,
        },
        where: { usuario_id: id },
      });
      return res.json(address);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

clientRouter.put("/client/profile/:id", hasRole("client"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "O ID deve ser um número." });
      return;
    }
    const { nome, email, dataNascimento, cpf } = req.body;
    const users = await prisma.usuario.update({
      where: { id },
      data: {
        nome,
        email,
        dataNascimento: new Date(dataNascimento),
        cpf,
      },
    });
    return res.json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

clientRouter.put(
  "/client/profile/:id/address",
  hasRole("client"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "O ID deve ser um número." });
        return;
      }
      const { logradouro, numero, cidade, uf, cep, complemento } = req.body;

      const search = await prisma.endereco.findFirst({
        where: { usuario_id: id },
      });

      const address = await prisma.endereco.update({
        data: { logradouro, numero, cidade, uf, cep, complemento },
        where: { id: search.id },
      });
      return res.json(address);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

clientRouter.put(
  "/client/profile/:id/password",
  hasRole("client"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "O ID deve ser um número." });
        return;
      }
      const { senhaAtual, senhaNova, confirmSenha } = req.body;

      if (senhaNova !== confirmSenha) {
        return res.status(400).json({ message: "As senhas não conferem." });
      }

      const user = await prisma.usuario.findFirst({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({ message: "E-mail não cadastrado." });
      }

      const isSamePassword = bcrypt.compareSync(senhaAtual, user.senha);

      if (isSamePassword) {
        const passwordHash = await bcrypt.hash(senhaNova, 12);
        const userUpdated = await prisma.usuario.update({
          where: { id },
          data: { senha: passwordHash },
        });
        return res.status(200).json(userUpdated);
      } else {
        return res.status(400).json({ message: "Senha atual incorreta." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

clientRouter.put(
  "/client/profile/:id/photo",
  hasRole("client"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "O ID deve ser um número." });
        return;
      }
      const { foto } = req.body;
      const users = await prisma.usuario.update({
        where: { id },
        data: { foto },
      });
      return res.json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

clientRouter.get("/client/cart/:id", hasRole("client"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "O ID deve ser um número." });
      return;
    }

    const carrinho = await prisma.carrinho.findFirst({
      where: { usuario_id: id },
    });
    if (carrinho) {
      const items = await prisma.item_carrinho.findMany({
        where: { carrinho_id: carrinho.id },
      });
      return res.status(200).json({ items, carrinho });
    } else {
      return res.status(200).json({ items: [], carrinho: null });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

clientRouter.post(
  "/client/cart/:id/add",
  hasRole("client"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "O ID deve ser um número." });
        return;
      }
      const carrinho = await prisma.carrinho.findFirst({
        where: { usuario_id: id },
      });
      const { produto_id } = req.body;
      if (carrinho) {
        const item = await prisma.item_carrinho.findFirst({
          where: { carrinho_id: carrinho.id, produto_id },
        });
        if (item) {
          const itemUpdated = await prisma.item_carrinho.update({
            data: {
              quantidade: item.quantidade + 1,
            },
            where: { id: item.id },
          });
          return res.status(200).json(itemUpdated);
        } else {
          const itemAdded = await prisma.item_carrinho.create({
            data: {
              produto_id,
              carrinho_id: carrinho.id,
            },
          });
          return res.status(200).json(itemAdded);
        }
      } else {
        const newCarrinho = await prisma.carrinho.create({
          data: {
            usuario_id: id,
          },
        });
        const item = await prisma.item_carrinho.create({
          data: {
            produto_id,
            carrinho_id: newCarrinho.id,
          },
        });
        return res.status(200).json(item);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

clientRouter.put(
  "/client/cart/:id/item",
  hasRole("client"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "O ID deve ser um número." });
        return;
      }
      const { quantidade } = req.body;
      if (quantidade > 0) {
        const item = await prisma.item_carrinho.update({
          data: {
            quantidade,
          },
          where: { id },
        });
        return res.status(200).json(item);
      } else {
        const item = await prisma.item_carrinho.delete({
          where: { id },
        });
        return res.status(200).json(item);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

clientRouter.post(
  "/client/cart/:id/finish",
  hasRole("client"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "O ID deve ser um número." });
        return;
      }
      const result = await prisma.$queryRaw`CALL FinalizarCompra(${id})`;
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

clientRouter.get("/client/orders/:id", hasRole("client"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "O ID deve ser um número." });
    }
    const items = await prisma.item_compra.findMany({
      where: { compra: { usuario_id: id } },
    });
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno no servidor.", error });
  }
});

clientRouter.get(
  "/client/orders/:usuario_id/products/:produto_id",
  hasRole("client"),
  async (req, res) => {
    try {
      const usuario_id = parseInt(req.params.usuario_id);
      const produto_id = parseInt(req.params.produto_id);
      if (isNaN(usuario_id) || isNaN(produto_id)) {
        return res.status(400).json({ message: "O ID deve ser um número." });
      }
      const product = await prisma.produto.findFirst({
        where: { id: produto_id },
      });
      const evaluate = await prisma.avaliacao.findFirst({
        where: { produto_id, usuario_id },
      });
      return res.status(200).json({ product, evaluate });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

clientRouter.get(
  "/client/orders/purchase/:id",
  hasRole("client"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "O ID deve ser um número." });
      }
      const purchase = await prisma.compra.findFirst({
        where: { id },
      });
      return res.status(200).json(purchase);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);

clientRouter.post(
  "/client/orders/:id/evaluate",
  hasRole("client"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { produto_id, nota } = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ message: "O ID deve ser um número." });
      }
      const evaluate = await prisma.avaliacao.create({
        data: {
          produto_id,
          usuario_id: id,
          nota,
        },
      });
      return res.status(200).json(evaluate);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", error });
    }
  }
);
