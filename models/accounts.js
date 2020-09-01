'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Accounts.hasOne(models.Values, { 
              sourceKey: 'id', 
              foreignKey: 'account_id', 
              as: 'values',
              onDelete: 'RESTRICT',
              onUpdate: 'RESTRICT'
      });
    }
  };
  Accounts.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    createdAt: {type: DataTypes.DATE, field:'created_at'},
    updatedAt: {type: DataTypes.DATE, field:'updated_at'},
    deletedAt: {type: DataTypes.DATE, field:'deleted_at', allowNull: true},
    // deletedAt: {type: DataTypes.DATE, field:'deletedAt'}
  }, {
    sequelize,
    modelName: 'Accounts',
    timestamps: true,
    paranoid: true,
  });
  return Accounts;
};