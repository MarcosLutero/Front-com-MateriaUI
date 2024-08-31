import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection'; // Importe sua conexão com o banco de dados
import Procurado from './procurado'; // Importe o modelo Procurado

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
    onDelete: 'CASCADE', // Deleta as fotos quando o procurado for deletado
  },
}, {
  sequelize,
  tableName: 'fotos_procurados',
});

export default FotoProcurado;
