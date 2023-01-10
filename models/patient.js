'use strict';
const {
  Model
} = require('sequelize');
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
  Patient.init({
    patientName: DataTypes.STRING,
    hospitalName: DataTypes.STRING,
    doctorName: DataTypes.STRING,
    serviceType: DataTypes.STRING,
    device: DataTypes.STRING,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    duration: DataTypes.STRING,
    PatientID: DataTypes.STRING,
    location:DataTypes.STRING,
    modifiedBy:DataTypes.STRING,
    assignStatus:{
      type:DataTypes.STRING,
      defaultValue:"UnAssigned"

    },
    
    contactNumber:DataTypes.STRING,
    address:DataTypes.STRING,
    logisticName:DataTypes.STRING,
    shippingStatus:DataTypes.STRING,
    AWB:DataTypes.STRING,
    shippingDate:DataTypes.DATE,
    returnLogisticsName:DataTypes.STRING,
    returnStatus:DataTypes.STRING,
    returnAWB:DataTypes.STRING,
    returnDate:DataTypes.DATE



    
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};