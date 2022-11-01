'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class screenshot_setting extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    screenshot_setting.init(
        {
            organization: DataTypes.STRING,
            teams: DataTypes.ARRAY(DataTypes.STRING),
            takeTime: DataTypes.JSON,
            time: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'screenshot_setting',
        }
    )
    return screenshot_setting
}
