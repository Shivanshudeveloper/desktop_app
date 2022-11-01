'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class team_users extends Model {
        static associate(models) {}
    }
    team_users.init(
        {
            fullName: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            organization: DataTypes.STRING,
            team: DataTypes.STRING,
            role: DataTypes.STRING,
            profilePicture: DataTypes.STRING,
            isVerified: DataTypes.BOOLEAN,
            visibility: DataTypes.BOOLEAN,
            time: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'team_users',
        }
    )
    return team_users
}
