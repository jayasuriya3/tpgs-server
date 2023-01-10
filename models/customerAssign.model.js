'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerAssign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  CustomerAssign.init(
    {
      // id: DataTypes.DataTypes.INTEGER,
      assigned_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
      },
      referenceIds: {
        type: DataTypes.ARRAY(DataTypes.DECIMAL)
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
      modelName: 'customerAssign',
      //freezeTableName: true,
    }
  );
  return CustomerAssign;
};
