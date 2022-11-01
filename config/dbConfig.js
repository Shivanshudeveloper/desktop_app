const Sequelize = require('sequelize')
require('dotenv').config()

const connectDB = () => {
  const sequelize = new Sequelize(`${process.env.CONNECTION_STRING}`, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  })

  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err)
    })
}

module.exports = connectDB
