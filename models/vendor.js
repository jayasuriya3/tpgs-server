'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vendor.init({

    vendorName:{ 
     type: DataTypes.STRING,
    unique:true
    }
      ,
      vendorid:{
        type:DataTypes.STRING,
      },
    email: DataTypes.STRING,
    address: DataTypes.STRING,
   city: DataTypes.JSONB,
   state: DataTypes.JSONB,
    country:DataTypes.JSONB,
    zipCode: DataTypes.STRING,
    primaryContactPerson: DataTypes.STRING,
    mobile: DataTypes.STRING,
    secondaryContactPerson: DataTypes.STRING,
    secondaryMobilePerson: DataTypes.STRING,
    primaryExtension: DataTypes.STRING,
    secondaryExtension: DataTypes.STRING,
    modifiedBy: DataTypes.STRING,
    modifiedByPhoto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Vendor',
  });
  return Vendor;
};