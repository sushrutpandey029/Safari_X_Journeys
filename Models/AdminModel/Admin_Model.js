import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";

const AdminModel = sequelize.define('safarix_admins', {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    accessToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
}, {
    tableName: 'safarix_admins',
    timestamps: true, // adds createdAt and updatedAt

});

export default AdminModel;