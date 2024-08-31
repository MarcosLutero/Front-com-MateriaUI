import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection'; // Importe sua conexão com o banco de dados

class Procurado extends Model {
  public id!: number;
  public nome!: string;
  public nomeMae!: string;
  public nomePai!: string;
  public cpf!: string;
  public naturalidade!: string;
  public municipio!: string;
  public uuid!: string; // UUID para armazenar a referência da foto no MinIO
}

Procurado.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: new DataTypes.STRING(128),
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
  municipio: {
    type: new DataTypes.STRING(128),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'procurado',
});

export default Procurado;
