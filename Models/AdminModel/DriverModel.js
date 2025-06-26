import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";

const Driver = sequelize.define('drivers', {
    driverId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "driver",
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    licenseNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    licenseExpiry: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "India",
    },
    pincode: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    experienceYears: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    rating: {
        type: DataTypes.FLOAT(2, 1),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
            min: 0,
            max: 5
        },
    },
    profilePhoto: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    aadharNumber: {
        type: DataTypes.STRING(12),
        allowNull: true,
    },
    panNumber: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    bloodGroup: {
        type: DataTypes.STRING(5),
        allowNull: true,
    },
    emergencyContact: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {
    tableName: 'drivers',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default Driver;