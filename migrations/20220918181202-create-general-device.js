'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GeneralDevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accessory: {
        type: Sequelize.STRING
      },
      manufactureName: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING
      },
      serialNo: {
        type: Sequelize.STRING
      },
      purchaseDate: {
        type: Sequelize.STRING
      },
      warranty: {
        type: Sequelize.STRING
      },
      mobileNo: {
        type: Sequelize.STRING
      },
      simSerialNo: {
        type: Sequelize.STRING
      },
      serviceProvider: {
        type: Sequelize.STRING
      },
      serviceType: {
        type: Sequelize.STRING
      },
      servicePlan: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GeneralDevices');
  }
};