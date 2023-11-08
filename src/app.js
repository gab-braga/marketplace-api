// Configuração das variáveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Configurações do app express
import express from "express";
const app = express();

import cors from "cors";
app.use(cors());

app.use(express.json({ limit: "50mb" }));

// Rotas públicas
import { publicRouter } from "./routes/public.js";
app.use(publicRouter);

// Rotas autenticação e autorização
import { authRouter } from "./routes/auth.js";
app.use(authRouter);

// Rotas cliente
import { clientRouter } from "./routes/client.js";
app.use(clientRouter);

// Rotas administrativas
import { adminRouter } from "./routes/admin.js";
app.use(adminRouter);

// Escuta do servidor
app.listen(8080, async () => {
  console.log("Server running in port 8080.");
});
