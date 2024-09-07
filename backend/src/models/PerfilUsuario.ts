import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection'; // Importe sua conexão com o banco de dados

class PerfilUsuario extends Model {}

PerfilUsuario.init({
    usuarioId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'usuario', // Nome da tabela referenciada
            key: 'id',         // Nome da coluna na tabela referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    perfilId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'perfs',   // Nome da tabela referenciada
            key: 'id',         // Nome da coluna na tabela referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }
}, {
    sequelize,
    tableName: 'perfil_usuario',
    timestamps: false // Desative timestamps se não precisar de createdAt e updatedAt
});

export default PerfilUsuario;
