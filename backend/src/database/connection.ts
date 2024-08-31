import { Sequelize } from "sequelize";

const seguranca = new Sequelize("mysql://root:root@database:3306/seguranca", {
    dialect: 'mysql',  // Certifique-se de que o dialeto esteja definido como 'mysql'
    dialectOptions: { autoJsonMap: false },
    logging: false
});

export default seguranca;
