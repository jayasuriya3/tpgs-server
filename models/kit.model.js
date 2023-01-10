'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Kit.init(
    {
      // id: DataTypes.DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
      },
      patientId: {
        type: DataTypes.DECIMAL
      },
      deviceListIds: {
        type: DataTypes.ARRAY(DataTypes.DECIMAL)
      },
      practice_admin_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      modified_by: {
        type: DataTypes.STRING,
      },
      meta: {
        type: DataTypes.STRING,
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
      modelName: 'kit',
      //freezeTableName: true,
    }
  );
  return Kit;
};
