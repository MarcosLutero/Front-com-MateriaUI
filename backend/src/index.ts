import * as dotenv from 'dotenv';
dotenv.config();
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import Routers from "./router/index";

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configura e registra os roteadores
Routers.forEach(router => {
  app.use(router);
});

// Configuração do Sequelize para conectar ao banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME??"seguranca",  // Nome do banco de dados
  process.env.DB_USER??"root",  // Usuário do banco de dados
  process.env.DB_PASS??"root",  // Senha do banco de dados
  {
    host: process.env.DB_HOST??"localhost",  // Host do banco de dados
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,  // Porta do banco de dados, com conversão para número
    dialect: "mysql",  // Dialeto do banco de dados
    logging: false,  // Desativa os logs SQL do Sequelize
  }
);

// Autentica a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao banco de dados com sucesso.');
  })
  .catch((error: Error) => {
    console.error('Erro ao conectar-se ao banco de dados:', error);
  });

// Define uma rota padrão
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor rodando com TypeScript, Sequelize e CORS!');
});

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
