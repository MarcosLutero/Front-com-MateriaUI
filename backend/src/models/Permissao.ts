import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection'; 

class Permissao extends Model {
    public id!: number;  // Adicione esta linha para definir a propriedade 'id'
    public nome!: string;
    public descricao!: string;
}

Permissao.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,  // Tipo de dado inteiro sem sinal
        autoIncrement: true,                // Auto-incremento
        primaryKey: true,                   // Chave primária
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'permissao',
});

export default Permissao;
