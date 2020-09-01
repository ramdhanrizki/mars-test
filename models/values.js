'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Values extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Values.belongsTo(models.Accounts, {
                foreignKey: 'account_id', 
                as: 'account' });
    }
  };
  Values.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    account_id: DataTypes.INTEGER,
    value1: DataTypes.INTEGER,
    value2: DataTypes.INTEGER,
    createdAt: {type: DataTypes.DATE, field:'created_at'},
    updatedAt: {type: DataTypes.DATE, field:'updated_at'},
    deletedAt: {type: DataTypes.DATE, field:'deleted_at', allowNull: true},
  }, {
    sequelize,
    modelName: 'Values',
    paranoid:true,
    timestamps: true,
  });
  return Values;
};