'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomCommand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CustomCommand.init({
    guildId: {type: DataTypes.STRING, primaryKey: true},
    name: {type: DataTypes.STRING, primaryKey: true},
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CustomCommand',
  });
  return CustomCommand;
};