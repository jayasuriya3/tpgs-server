'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderShipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderShipping.init({
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      unique:true
  },
    logisticsName: DataTypes.STRING,
    shippingStatus: DataTypes.STRING,
    AWB: DataTypes.STRING,
    shippingDate: DataTypes.STRING,
    isShipped: DataTypes.BOOLEAN,
    insurance: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderShipping',
  });
  return OrderShipping;
};