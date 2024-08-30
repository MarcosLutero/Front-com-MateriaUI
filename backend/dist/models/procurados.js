"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index")); // Assumindo que você exportou o sequelize no index.ts
class Procurados extends sequelize_1.Model {
}
Procurados.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    dataNascimento: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    nomeMae: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    nomePai: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    cpf: {
        type: new sequelize_1.DataTypes.STRING(11),
        allowNull: false,
        unique: true,
    },
    naturalidade: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
}, {
    sequelize: index_1.default, // Conexão ao banco de dados
    tableName: 'procurados',
});
exports.default = Procurados;
