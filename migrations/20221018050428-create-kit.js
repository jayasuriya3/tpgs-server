'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Kits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      service: {
        type: Sequelize.STRING
      },
      serviceId: {
        type: Sequelize.STRING
      },
      accessory: {
        type: Sequelize.STRING
      },
      accessoryId: {
        type: Sequelize.STRING
      },
      hospital: {
        type: Sequelize.STRING
      },
      lastModifiedBy: {
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
    await queryInterface.dropTable('Kits');
  }
};