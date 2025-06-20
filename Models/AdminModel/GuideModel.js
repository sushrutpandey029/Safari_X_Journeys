import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";

const Guide = sequelize.define('guides', {
    guideId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    guidename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    languagespoken: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    experience_years: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    profile_image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    canDrive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    driverLicense: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'guides',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

export default Guide;