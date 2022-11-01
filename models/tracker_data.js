'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tracker_data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tracker_data.init(
    {
      userid: DataTypes.STRING,
      team: DataTypes.STRING,
      organization: DataTypes.STRING,
      apptitle: DataTypes.STRING,
      platform: DataTypes.STRING,
      owner: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      memory: DataTypes.STRING,
      category: DataTypes.STRING,
      type: DataTypes.STRING,
      icon: DataTypes.STRING,
      imgName: DataTypes.ARRAY(DataTypes.STRING),
      time: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'tracker_data',
    }
  )
  return tracker_data
}
