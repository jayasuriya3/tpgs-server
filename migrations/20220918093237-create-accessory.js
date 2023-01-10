'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accessories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      service: {
        type: Sequelize.STRING
      },
      accessory: {
        type: Sequelize.STRING
      },
      accessoryType: {
        type: Sequelize.STRING
      },
      returnStatus: {
        type: Sequelize.STRING
      },
      createBy: {
        type: Sequelize.STRING
      },
      creatorPhoto: {
        type: Sequelize.STRING
      },
      modifiedBy: {
        type: Sequelize.STRING
      },
      modifierPhoto: {
        type: Sequelize.STRING
      },
      disable: {
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
    await queryInterface.dropTable('Accessories');
  }
};