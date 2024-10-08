import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection'; 
import Procurado from './Procurado';

class FotoProcurado extends Model {
  public id!: number;
  public nome!: string;
  public tamanho!: number;
  public uuid!: string; // UUID para armazenar a referência da foto no MinIO
  public procuradoId!: number; // Chave estrangeira para associar ao Procurado
}

FotoProcurado.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  tamanho: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  uuid: {
    type: new DataTypes.STRING(36),
    allowNull: false,
    unique: true,
  },
  procuradoId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Procurado,
      key: 'id'
    },
    onDelete: 'CASCADE', // Deleta as foto quando o procurado for deletado
  },
}, {
  sequelize,
  tableName: 'foto_procurado',
});

export default FotoProcurado;
