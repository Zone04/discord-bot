'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlacklistUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BlacklistUser.init({
    user: {type: DataTypes.STRING, primaryKey: true},
    guild_id: {type: DataTypes.STRING, primaryKey: true}
  }, {
    sequelize,
    modelName: 'BlacklistUser',
  });
  return BlacklistUser;
};