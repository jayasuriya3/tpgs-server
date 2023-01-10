'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserAccount.init({
    userType:DataTypes.STRING,
    customer:DataTypes.STRING,
    name: DataTypes.STRING,
    userName: DataTypes.STRING,
    contactPerson:DataTypes.STRING,  
    email: DataTypes.STRING,
    location:DataTypes.STRING, 
    userName:DataTypes.STRING, 
    password: DataTypes.STRING,
    role: {
      type: DataTypes.JSONB
    },
    // photo: DataTypes.STRING,
    emailNotification:DataTypes.STRING,
notificationEmail:DataTypes.STRING,
smsNotification:DataTypes.STRING,
smsContactNumber:DataTypes.STRING,
messengerNotification:DataTypes.STRING,
messengerType:DataTypes.STRING,
messengerContactNumber:DataTypes.STRING,
createdBy:DataTypes.STRING,
createdByPhoto:DataTypes.STRING,
modifiedBy:DataTypes.STRING,
modifiedByPhoto:DataTypes.STRING,
disable:{
  type:DataTypes.BOOLEAN,
  defaultValue:false
}



  }, {
    sequelize,
    modelName: 'UserAccount',
  });
  return UserAccount;
};