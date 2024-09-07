import { Model, DataTypes, BelongsToManyAddAssociationsMixin } from "sequelize";
import sequelize from "../database/connection";
import Permissao from "./Permissao";

class Perfil extends Model {
  public id!: number;
  public nome!: string;
  public Permissoes?: Permissao[]; // Adicione a propriedade `Perfis`

  public addPermissoes!: BelongsToManyAddAssociationsMixin<Permissao, number>;
}
Perfil.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED, // Tipo de dado inteiro sem sinal
      autoIncrement: true, // Auto-incremento
      primaryKey: true // Chave primária
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "perfil"
  }
);

export default Perfil;
