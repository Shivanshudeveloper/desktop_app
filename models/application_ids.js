'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class application_ids extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    application_ids.init(
        {
            applicationid: DataTypes.STRING,
            organization: DataTypes.STRING,
            userId: DataTypes.STRING,
            time: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'application_ids',
        }
    )
    return application_ids
}
