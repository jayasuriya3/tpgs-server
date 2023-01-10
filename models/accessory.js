'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Accessory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Accessory.init({
    service: DataTypes.STRING,
    accessory: DataTypes.STRING,
    accessoryType: DataTypes.STRING,
    returnStatus: DataTypes.STRING,
    createBy: DataTypes.STRING,
    creatorPhoto: DataTypes.STRING,
    modifiedBy: DataTypes.STRING,
    modifierPhoto: DataTypes.STRING,
    
    disable: {
      type:DataTypes.BOOLEAN,
      defaultValue:false
      
    },
 
  }
  
  , {
    sequelize,
    modelName: 'Accessory',
  });
  return Accessory;
};