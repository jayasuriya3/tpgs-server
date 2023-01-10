'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Service.init(
    {
      // id: DataTypes.DataTypes.INTEGER,
      patientName: {
        type: DataTypes.STRING,
      },
      patientId: {
        type: DataTypes.INTEGER,
      },
      age: {
        type: DataTypes.INTEGER,
      },
      physician_id: {
        type: DataTypes.INTEGER,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      device_id: {
        type: DataTypes.INTEGER,
      },
      device_name: {
        type: DataTypes.STRING,
      },
      service_type: {
        type: DataTypes.STRING,
      },
      service_status: {
        type: DataTypes.STRING,
      },
      notification: {
        type: DataTypes.STRING,
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      meta: {
        type: DataTypes.STRING,
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
      modelName: 'service',
      //freezeTableName: true,
    }
  );
  return Service;
};
