'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class patientKitAssign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  patientKitAssign.init(
    {
      // id: DataTypes.DataTypes.INTEGER,
      patient_name: {
        type: DataTypes.STRING,
      },
      patientId: {
        type: DataTypes.INTEGER,
      },
      kit_id: {
        type: DataTypes.INTEGER,
      },
      hospital: {
        type: DataTypes.STRING,
      },
      physician_id: {
        type: DataTypes.INTEGER,
      },
      physician_name: {
        type: DataTypes.STRING,
      },
      modifiedBy: {
        type: DataTypes.STRING,
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
      location: {
        type: DataTypes.STRING,
      },
      zipcode: {
        type: DataTypes.INTEGER,
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      modifiedAt: {
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
      modelName: 'patientKitAssign',
      //freezeTableName: true,
    }
  );
  return patientKitAssign;
};
