import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";

const CabDetails = sequelize.define('cabdetails', {
    cabid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cabtype: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cabseats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cabnumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price_per_km: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    price_per_day: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    images: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'cabdetails',
    timestamps: false
});



export default CabDetails;