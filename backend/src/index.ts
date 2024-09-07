import * as dotenv from 'dotenv';
dotenv.config();
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import Routers from "./router/index";
import authenticate from "./middleware/authenticate"
import initdb from "./database/initdb"

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(authenticate()); // Middleware de autenticação aplicado globalmente

// Configuração do Sequelize para conectar ao banco de dados
const sequelize = new Sequelize(
  "seguranca", // Nome da base de dados
  "root",      // Nome de usuário do MySQL
  "root",      // Senha do MySQL
  {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    logging: false,
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

const main = async () => {
  initdb(); // Inicializa os relacionamentos do banco de dados

  // Inicia o servidor
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

  // Registra as rotas após inicializar o banco de dados e middleware
  Routers.forEach(router => {
    app.use(router);
  });
}

main(); // Chama a função principal para iniciar o aplicativo
