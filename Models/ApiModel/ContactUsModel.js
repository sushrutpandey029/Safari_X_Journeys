import { DataTypes } from "sequelize";

import sequelize from "../../DB_Connection/MySql_Connnet.js";

const contactUs = sequelize.define('contactUs', {

    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:null
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    message: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:null
    },

    place: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    }
})

export default contactUs;
