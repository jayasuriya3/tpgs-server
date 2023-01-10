'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeviceList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  DeviceList.init(
    {
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accessory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      practice_admin_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      device_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      device_model: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      purchase_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiry_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      warranty: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      warranty_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      additional_info: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comments: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_available: {
        // type: DataTypes.ENUM("available", "defective", "assigned"),
        type: DataTypes.STRING,

        defaultValue: "available",
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
      modelName: 'deviceList',
      //freezeTableName: true,
    }
  );
  return DeviceList;
};
