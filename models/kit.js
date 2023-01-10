'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kit.init({
      id:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    quantity: DataTypes.STRING,
     
  
    service: DataTypes.STRING,
    serviceId: DataTypes.STRING,
    accessory: DataTypes.STRING,
    accessoryId: DataTypes.STRING,
    hospitalName: DataTypes.STRING,
    patientName:DataTypes.STRING,
    doctorName:DataTypes.STRING,
    lastModifiedBy: DataTypes.STRING,
    shippingStatus:DataTypes.STRING,
   
    assignStatus:{
      type:DataTypes.STRING,
      defaultValue:"UnAssigned"

    },
    assignedDate:DataTypes.DATE,
    kitReceived:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    deviceReceiveStatusCheck:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    status:DataTypes.STRING,




  }, {
    sequelize,
    modelName: 'Kit',
  });
  return Kit;
};