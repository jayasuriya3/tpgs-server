'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderShippings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      logisticsName: {
        type: Sequelize.STRING
      },
      shippingStatus: {
        type: Sequelize.STRING
      },
      AWB: {
        type: Sequelize.STRING
      },
      shippingDate: {
        type: Sequelize.STRING
      },
      insurance: {
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
    await queryInterface.dropTable('OrderShippings');
  }
};