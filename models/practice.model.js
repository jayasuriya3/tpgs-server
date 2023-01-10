'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Practice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Practice.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
      contact_person: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Contact Number address already in use!'
        }
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      email_1: {
        type: DataTypes.STRING,
      }, 
      contact_person_1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_number_1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address_1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address_2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zip_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      service_mode: {
     //   type: DataTypes.ENUM("idtf", "ppd", "both"),
        type: DataTypes.STRING,

        allowNull: true,
      },
      service_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      interpretation_mode: {
        type: DataTypes.STRING,

     //   type: DataTypes.ENUM("self", "techindia"),
        allowNull: true,
      },
      allow_service: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      email_physician: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      display_revenue: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      require_signature: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      send_qt: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      auto_intrepretation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      time_zone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date_time_formart: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_notification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notification_emailid: {
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
      currency_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password_policy: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: 'practice',
      //freezeTableName: true,
    }
  );
  return Practice;
};
