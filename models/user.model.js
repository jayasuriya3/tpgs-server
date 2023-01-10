'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      // id: DataTypes.DataTypes.INTEGER,
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail:true
        },
        unique: {
          args: true,
          msg: 'Email address already in use!'
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username already in use!'
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      practiceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      practice: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_person: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Contact Number already in use!'
        }
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      qualification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      practice_admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_notification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sms_notification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      messenger_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      messenger_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_activity: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      totpSecret: {
        type: DataTypes.STRING,
      },
      totpAuthUrl: {
        type: DataTypes.STRING,
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modified_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'user',
      //freezeTableName: true,
    }
  );
  return User;
};
