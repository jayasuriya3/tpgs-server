'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Patient.init(
    {
      // id: DataTypes.DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
      },
      patientId: {
        type: DataTypes.STRING,
      },
      firstname: {
        type: DataTypes.STRING,
      },
      middlename: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
      },
      language: {
        type: DataTypes.STRING,
      },
      dob: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
      phone_number_alt: {
        type: DataTypes.STRING,
      },
      insurance_policy_number: {
        type: DataTypes.STRING,
      },
      insurance_policy_name: {
        type: DataTypes.STRING,
      },
      insurance_group: {
        type: DataTypes.STRING,
      },
      insurance1_policy_number: {
        type: DataTypes.STRING,
      },
      insurance1_policy_name: {
        type: DataTypes.STRING,
      },
      insurance1_group: {
        type: DataTypes.STRING,
      },
      complaints: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      physician_id: {
        type: DataTypes.INTEGER,
      },
      physician_assist_id: {
        type: DataTypes.INTEGER,
      },
      street: {
        type: DataTypes.STRING,
      },
      street1: {
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
      event_id: {
        type: DataTypes.INTEGER,
      },
      kit_id: {
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
      age: {
        type: DataTypes.INTEGER,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      notification: {
        type: DataTypes.STRING,
      },
      meta: {
        type: DataTypes.STRING,
      },
      service_status: {
        type: DataTypes.STRING,
      },
      report_type: {
        type: DataTypes.STRING,
      },
      reasonForTest: {
        type: DataTypes.STRING,
      },
      indication: {
        type: DataTypes.STRING,
      },
      medication: {
        type: DataTypes.STRING,
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
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
      modelName: 'patient',
      //freezeTableName: true,
    }
  );
  return Patient;
};
