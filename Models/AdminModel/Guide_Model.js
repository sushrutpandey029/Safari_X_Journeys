import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";

const Guide = sequelize.define('guides', {
    guidename: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Guide's full name"
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    languagespoken: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Comma-separated languages"
    },
    experience_years: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Experience in years"
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
    }

}, {
    tableName: 'guides',
    timestamps: false
});



export default Guide;