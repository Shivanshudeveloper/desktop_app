'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tracker_data', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      userid: {
        type: Sequelize.STRING,
      },
      team: {
        type: Sequelize.STRING,
      },
      organization: {
        type: Sequelize.STRING,
      },
      apptitle: {
        type: Sequelize.STRING,
      },
      platform: {
        type: Sequelize.STRING,
      },
      owner: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.INTEGER,
      },
      memory: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      icon: {
        type: Sequelize.STRING,
      },
      imgName: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      time: {
        primaryKey: true,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tracker_data')
  },
}
