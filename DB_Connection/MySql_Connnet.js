import { Sequelize } from "sequelize";

const sequelize = new Sequelize('safariXjourneys', 'root', 'root@123', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false, 
});

const Db_connetion = async () => {
    try {
        await sequelize.authenticate();
        console.log("db connect successfuly")
    } catch (err) {
        console.error("Error while connecting to the database", err);
    }
};

Db_connetion();

export default sequelize;
