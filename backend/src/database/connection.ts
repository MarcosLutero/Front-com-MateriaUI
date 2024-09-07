import { Sequelize } from "sequelize";

const seguranca = new Sequelize("mysql://root:root@localhost:3306/seguranca", {
    dialect: 'mysql',  // Certifique-se de que o dialeto esteja definido como 'mysql'
    dialectOptions: { autoJsonMap: false },
    logging: false
});

export default seguranca;
