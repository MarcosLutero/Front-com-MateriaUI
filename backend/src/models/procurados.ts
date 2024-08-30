import { Model, DataTypes } from 'sequelize';
import sequelize from './index'; // Assumindo que você exportou o sequelize no index.ts

class Procurados extends Model {
  public id!: number;
  public nome!: string;
  public dataNascimento!: Date;
  public nomeMae!: string;
  public nomePai!: string;
  public cpf!: string;
  public naturalidade!: string;
}

Procurados.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  dataNascimento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nomeMae: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  nomePai: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  cpf: {
    type: new DataTypes.STRING(11),
    allowNull: false,
    unique: true,
  },
  naturalidade: {
    type: new DataTypes.STRING(128),
    allowNull: true,
  },
}, {
  sequelize, // Conexão ao banco de dados
  tableName: 'procurados',
});

export default Procurados;
