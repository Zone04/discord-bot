'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlacklistGuild extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BlacklistGuild.init({
    guildId: {type: DataTypes.STRING, primaryKey: true},
    command: {type: DataTypes.STRING, primaryKey: true}
  }, {
    sequelize,
    modelName: 'BlacklistGuild',
  });
  return BlacklistGuild;
};