import { DataTypes } from "sequelize";
import sequelize from "../../DB_Connection/MySql_Connnet.js";

const BannerModel = sequelize.define('Banner', {
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'Banner',
    timestamps: true,

});

export default BannerModel;