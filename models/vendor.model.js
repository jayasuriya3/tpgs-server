'use strict';
const { Model } = require('sequelize');
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

  Vendor.init(
    {
      vendor_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      practice_admin_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        },
        unique: {
          args: true,
          msg: 'Email address already in use!'
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      p_contact_person: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      p_mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      s_contact_person: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      s_mobile: {
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
      modelName: 'vendor',
      //freezeTableName: true,
    }
  );
  return Vendor;
};
