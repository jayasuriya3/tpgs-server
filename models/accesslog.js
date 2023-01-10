'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccessLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AccessLog.init({
    name: DataTypes.STRING,
    userName: DataTypes.STRING,
    userType: DataTypes.STRING,
    activity: DataTypes.STRING,
    ipAddress: DataTypes.STRING,
    ipLocation: DataTypes.STRING,
    logDateTime: DataTypes.DATE,
    

  }
  
  , {
    sequelize,
    modelName: 'AccessLog',
  });
  return AccessLog;
};