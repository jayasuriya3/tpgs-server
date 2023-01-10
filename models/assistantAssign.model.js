'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AssistantAssign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  AssistantAssign.init(
    {
      // id: DataTypes.DataTypes.INTEGER,
      assigned_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      customer_by_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      practice_by_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      physician_by_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      practice_admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      modelName: 'assistantAssign',
      //freezeTableName: true,
    }
  );
  return AssistantAssign;
};
