'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GeneralDevice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GeneralDevice.init({
    accessory: DataTypes.STRING,
    manufactureName: DataTypes.STRING,
    model: DataTypes.STRING,
    serialNo: DataTypes.STRING,
    purchaseDate: DataTypes.STRING,
    warranty: DataTypes.STRING,
    mobileNo: DataTypes.STRING,
    simSerialNo: DataTypes.STRING,
    serviceProvider: DataTypes.STRING,
    serviceType: DataTypes.STRING,
    servicePlan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GeneralDevice',
  });
  return GeneralDevice;
};