import { DataTypes } from "sequelize";
import sequelize from "../DB_Connection/MySql_Connect.js";

const CabDetails = sequelize.define('cabdetails', {
    cabtype: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    cabimage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    cabstatus: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    cabnumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        defaultValue: null
    },
    seatingcapacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
});

export default CabDetails;
