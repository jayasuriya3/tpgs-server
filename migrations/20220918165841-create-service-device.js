'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ServiceDevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendor: {
        type: Sequelize.STRING
      },
      service: {
        type: Sequelize.STRING
      },
      accessory: {
        type: Sequelize.STRING
      },
      deviceSerialNo: {
        type: Sequelize.STRING
      },
      deviceModel: {
        type: Sequelize.STRING
      },
      purchaseDate: {
        type: Sequelize.STRING
      },
      expirityDate: {
        type: Sequelize.STRING
      },
      warranty: {
        type: Sequelize.STRING
      },
      additionalInfo: {
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
    await queryInterface.dropTable('ServiceDevices');
  }
};