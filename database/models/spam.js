'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Spam.init({
    source: DataTypes.STRING,
    target: DataTypes.STRING,
    number: DataTypes.INTEGER,
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    channel: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Spam',
  });
  return Spam;
};