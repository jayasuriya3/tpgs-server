'use strict';

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DeviceData extends Model {
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
    DeviceData.init({
        accessoryId: DataTypes.STRING,
        accessoryName: DataTypes.STRING,
        serviceId: DataTypes.STRING,
        serviceName: DataTypes.STRING,
        vendorId: DataTypes.STRING,
        vendorName: DataTypes.STRING,
        deviceSerialNo: DataTypes.STRING,
        deviceModel: DataTypes.STRING,
        deviceId: {
            type: DataTypes.STRING,
            unique: true
        },
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
        kitId: DataTypes.STRING,
        deviceStatusComment: DataTypes.STRING,
        customerName: DataTypes.STRING,
        createdBy: DataTypes.STRING,
        editedBy: DataTypes.STRING,
        ordersId: DataTypes.STRING,
        receiveStatus: DataTypes.STRING,
        deviceStatusUpdateDate: DataTypes.DATE,
        practice_admin_id: DataTypes.STRING,


    }, {
        sequelize,
        modelName: 'deviceData',
    });
    return DeviceData;
};