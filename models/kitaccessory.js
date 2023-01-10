'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KitAccessory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // console.log(Service,this)
      // this.belongsTo(Service, { foreignKey: 'serviceId' }),
      // this.belongsTo(Accessory, { foreignKey: 'accessoryId' })
      // define association here
    }
  }
  KitAccessory.init({
    accessory: DataTypes.STRING,
    service: DataTypes.STRING,
    vendorId: DataTypes.STRING,
    vendor: DataTypes.STRING,
    deviceSerialNo: DataTypes.STRING,
    deviceModel: DataTypes.STRING,
    deviceId: DataTypes.STRING,
    purchaseDate: DataTypes.STRING,
    expiryDate: DataTypes.STRING,
    warranty: DataTypes.STRING,
    additionalInfo: DataTypes.STRING,
    mobileManufactureName: DataTypes.STRING,
    mobileModel: DataTypes.STRING,
    mobileSerialNo: DataTypes.STRING,
    mobilePurchaseDate: DataTypes.STRING,
    mobileWarranty: DataTypes.STRING,
    mobileNo: DataTypes.STRING,
    simSerialNo: DataTypes.STRING,
    serviceProvider: DataTypes.STRING,
    serviceType: DataTypes.STRING,
    servicePlan: DataTypes.STRING,
    accessoryType: DataTypes.STRING,
    warrantyTime: DataTypes.STRING,
    returnStatus: DataTypes.STRING,
    deviceStatus: DataTypes.STRING,
    accessoryId: DataTypes.STRING,
    serviceId: DataTypes.STRING,
    receiveStatus: DataTypes.STRING,
    comment: DataTypes.STRING,
    deviceStatusComment: DataTypes.STRING,
    createdBy:DataTypes.STRING,
  editedBy:DataTypes.STRING,
  deviceStatusUpdateDate:DataTypes.DATE,

    
  

  }, {
    sequelize,
    modelName: 'KitAccessory',
  });
  return KitAccessory;
};