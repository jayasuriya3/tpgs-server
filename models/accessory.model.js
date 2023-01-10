'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Accessory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Accessory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      practice_admin_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      device_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
      },
      return_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modified_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'accessory',
      //freezeTableName: true,
    }
  );
  return Accessory;
};
