import { Model, DataTypes, BelongsToManyAddAssociationsMixin } from 'sequelize';
import sequelize from '../database/connection';
import Perfil from './Perfil';
import FotoUsuario from './FotoUsuario';

class Usuario extends Model {
  public id!: number;
  public nome!: string;
  public cpf!: string;
  public email!: string;
  public naturalidade!: string;
  public municipio!: string;
  public senha!: string;
  public status!: string;
  public Perfis?: Perfil[]; // Adicione a propriedade `Perfis`
  public FotoUsuario?: FotoUsuario[];

}

Usuario.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  email: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  cpf: {
    type: new DataTypes.STRING(11),
    allowNull: false,
    unique: true,
  },
  senha: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  naturalidade: {
    type: new DataTypes.STRING(128),
    allowNull: true,
  },
  status: {
    type: new DataTypes.STRING(128),
    defaultValue: 'Ativo'
  },
  municipio: {
    type: new DataTypes.STRING(128),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'usuario',
});

export default Usuario;
