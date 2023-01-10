'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Logistic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Logistic.init({
  
    logisticName:DataTypes.STRING,
    shippingStatus:DataTypes.STRING,
    AWB:DataTypes.STRING,
    shippingDate:DataTypes.STRING,
    returnLogisticsName:DataTypes.STRING,
    returnStatus:DataTypes.STRING,
    returnAWB:DataTypes.STRING,
    returnDate:DataTypes.STRING,
    createdBy:DataTypes.STRING,
    modifiedBy:DataTypes.STRING,



    
  }, {
    sequelize,
    modelName: 'Logistic',
  });
  return Logistic;
};