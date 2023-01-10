'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    //  this.hasMany(Device, { foreignKey: 'serviceId' })
      // define association here
    }
  }
  Order.init({
    id:{
        type:DataTypes.UUID,
        primaryKey:true
    },
    orderId:{
      type:DataTypes.STRING
    },
    quantity: DataTypes.STRING,
    customerName:DataTypes.STRING,
    shippingStatus:DataTypes.STRING,
    device:DataTypes.STRING,
     
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};