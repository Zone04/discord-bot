'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlacklistChan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BlacklistChan.init({
    chan: {type: DataTypes.STRING, primaryKey: true},
    command: {type: DataTypes.STRING, primaryKey: true}
  }, {
    sequelize,
    modelName: 'BlacklistChan',
  });
  return BlacklistChan;
};