'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeviceDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  DeviceDetail.init(
    {
      accessory_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      manuf_name: {
        type: DataTypes.STRING,
        defaultValue: false,
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      serial_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      purchase_date: {
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
      mobile_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sim_serial_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service_provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service_type: {
        //type: DataTypes.ENUM("GSM", "CDMA"),
        type: DataTypes.STRING,

        allowNull: false,
      },
      service_plan: {
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
      modelName: 'deviceDetail',
      //freezeTableName: true,
    }
  );
  return DeviceDetail;
};
