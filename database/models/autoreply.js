'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AutoReply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AutoReply.init({
    role: DataTypes.STRING,
    guild: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AutoReply',
  });
  return AutoReply;
};