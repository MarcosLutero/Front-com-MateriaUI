"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'database', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
});
sequelize.authenticate()
    .then(() => {
    console.log('Conectado ao banco de dados com sucesso.');
})
    .catch((error) => {
    console.error('Erro ao conectar-se ao banco de dados:', error);
});
app.get('/', (req, res) => {
    res.send('Servidor rodando com TypeScript, Sequelize e CORS!');
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
