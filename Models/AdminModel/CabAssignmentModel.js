import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";
import Guide from "../AdminModel/GuideModel.js";
import Driver from '../AdminModel/DriverModel.js';

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

CabAssignment.belongsTo(Guide, {
  foreignKey: 'guideId',
  targetKey: 'guideId',
  as: 'assignedGuide' // ✅ Unique alias
});

CabAssignment.belongsTo(Driver, {
  foreignKey: 'driverId',
  targetKey: 'driverId', // Use the correct PK if different
  as: 'assignedDriver'
});

export default CabAssignment;