import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";

const CabDetails = sequelize.define('cabdetails', {
    cabId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    cabtype: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    cabseats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [4],
                msg: "Cab must have at least 2 seats"
            },
            max: {
                args: [10],
                msg: "Cab cannot have more than 20 seats"
            }
        },
    },
    cabnumber: {
        type: DataTypes.STRING(20),
        allowNull: false,

    },
    price_per_km: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Price per km cannot be negative"
            }
        },
    },
    price_per_day: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Price per day cannot be negative"
            }
        },
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    hasDedicatedDriver: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'cabdetails',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default CabDetails;