import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection'; // Importe sua conexão com o banco de dados

class PerfilPermissao extends Model {}

PerfilPermissao.init({
    perfilId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'perfil', // Nome da tabela referenciada
            key: 'id',       // Nome da coluna na tabela referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    permissaoId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'permissao', // Nome da tabela referenciada
            key: 'id',           // Nome da coluna na tabela referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }
}, {
    sequelize,
    tableName: 'perfil_permissao',
    timestamps: false // Desative timestamps se não precisar de createdAt e updatedAt
});

export default PerfilPermissao;
