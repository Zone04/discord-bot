'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AutoPing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AutoPing.init({
    role: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AutoPing',
  });
  return AutoPing;
};