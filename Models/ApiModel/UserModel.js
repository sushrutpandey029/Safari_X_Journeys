import { DataTypes } from "sequelize";

import sequelize from "../../DB_Connection/MySql_Connnet.js";

const users = sequelize.define('safarix_users', {
    profileimage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    emailid: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null, // Keeps it nullable by default until a token is assigned
    }
})

export default users;
