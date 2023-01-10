"use strict";
const { Model,Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init(
    {
      customerName: DataTypes.STRING,
      organizationName: DataTypes.STRING,
      contactPerson: DataTypes.STRING,
      mobileNumber: DataTypes.STRING,
      email: DataTypes.STRING,
      contactPerson2:DataTypes.STRING,
      mobileNumber2:DataTypes.STRING,
      email2:DataTypes.STRING,
      logo:DataTypes.STRING,
     address: DataTypes.STRING,
     addressLine1: DataTypes.STRING,
     addressLine2: DataTypes.STRING,
     
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      zip: DataTypes.STRING, 
      customerType: DataTypes.STRING, 
      serviceType: {
        type: DataTypes.JSONB
      
      
      },
      serviceMode: {
        type: DataTypes.JSONB
      },
      interpretationMode: {
        type: DataTypes.JSONB

      },
      customOption: {
        type: DataTypes.JSONB
      },
      autoInterpretationTemplate:DataTypes.STRING,
      timeZone:DataTypes.STRING,
      dateTimeFormat:DataTypes.STRING,
      emailNotification:DataTypes.STRING,
      emailNotificationEmail:DataTypes.STRING,
      smsNotification:DataTypes.STRING,
      smsNotificationContact:DataTypes.STRING,
      messengerNotification:DataTypes.STRING,
      messengerType:DataTypes.STRING,
      messengerNotificationContact:DataTypes.STRING,
      currencyType:DataTypes.STRING,
      passwordRotationPolicy:DataTypes.STRING,
      createdBy:DataTypes.STRING,
      createdByPhoto:DataTypes.STRING,
      modifiedBy:DataTypes.STRING,
      modifiedByPhoto:DataTypes.STRING





    },
    {
      sequelize,
      modelName: "Customer",
    }
  );
  return Customer;
};
