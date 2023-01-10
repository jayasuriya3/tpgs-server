'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceDevice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ServiceDevice.init({
    vendor: DataTypes.STRING,
    service: DataTypes.STRING,
    accessory: DataTypes.STRING,
    deviceSerialNo: DataTypes.STRING,
    deviceModel: DataTypes.STRING,
    purchaseDate: DataTypes.STRING,
    expirityDate: DataTypes.STRING,
    warranty: DataTypes.STRING,
    additionalInfo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ServiceDevice',
  });
  return ServiceDevice;
};