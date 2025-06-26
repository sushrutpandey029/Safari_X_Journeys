import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";

const TestimonialsModel = sequelize.define("testimonials", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    image: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    rating: {
        type: DataTypes.FLOAT(2, 1),
        allowNull: true,
        defaultValue: 0.0,
        validate: {
            min: 0,
            max: 5
        }
    }

}, {
    timestamps: true
});

export default TestimonialsModel;