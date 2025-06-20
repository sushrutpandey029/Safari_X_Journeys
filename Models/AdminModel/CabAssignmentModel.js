import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";

const CabAssignment = sequelize.define('cabassignments', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cabId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    guideId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    assignmentType: {
        type: DataTypes.ENUM('driver', 'guide-as-driver', 'both'),
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'cabassignments',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default CabAssignment;