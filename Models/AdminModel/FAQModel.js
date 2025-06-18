import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";

const FAQModel = sequelize.define('FAQ', {
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'FAQ',
    timestamps: true,

});

export default FAQModel;