import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection'; 
import Usuario from './Usuario';

class FotoUsuario extends Model {
  public id!: number;
  public nome!: string;
  public tamanho!: number;
  public uuid!: string; // UUID para armazenar a referência da foto no MinIO
  public UsuarioId!: number; // Chave estrangeira para associar ao Procurado
}

FotoUsuario.init({
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
  UsuarioId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    },
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  tableName: 'foto_usuario',
});

export default FotoUsuario;
