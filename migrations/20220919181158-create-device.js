'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Devices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accessory: {
        type: Sequelize.STRING
      },
    serviceId: {
        type: Sequelize.INTEGER
      },
      accessoryId: {
        type: Sequelize.INTEGER
      },
      service: {
        type: Sequelize.STRING
      },
      vendor: {
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
      expiryDate: {
        type: Sequelize.STRING
      },
      warranty: {
        type: Sequelize.STRING
      },
      additionalInfo: {
        type: Sequelize.STRING
      },
      mobileManufactureName: {
        type: Sequelize.STRING
      },
      mobileModel: {
        type: Sequelize.STRING
      },
      mobileSerialNo: {
        type: Sequelize.STRING
      },
      mobilePurchaseDate: {
        type: Sequelize.STRING
      },
      mobileWarranty: {
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
    await queryInterface.dropTable('Devices');
  }
};