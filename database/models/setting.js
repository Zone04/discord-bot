'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Setting.init({
    spamLimit: {
      type: DataTypes.INTEGER,
      set(value) {
        if (parseInt(value) <= 0) { throw new Error('Unauthorized value'); }
        this.setDataValue('spamLimit', value);
      }
    }
  }, {
    sequelize,
    modelName: 'Setting',
  });
  return Setting;
};