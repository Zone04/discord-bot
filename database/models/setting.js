'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    static attributes = {
      spamLimit: {
        type: DataTypes.INTEGER,
        set(value) {
          if (parseInt(value) <= 0) { throw new Error('Unauthorized value'); }
          this.setDataValue('spamLimit', value);
        },
        description: "Taille maximale d'un spam",
      },
      logChan: {
        type: DataTypes.STRING,
        set(value) {
          if (value == 'null') {value = null;}
          this.setDataValue('logChan', value);
        },
        description: "ID du channel de logs pour le bot",
      },
      easterProba: {
        type: DataTypes.FLOAT,
        set(value) {
          if (value > 1 || value < 0) { throw new Error('Unauthorized value'); }
          this.setDataValue('easterProba', value);
        },
        
        description: "Probabilité de l'easter egg",
      }
    };
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Setting.init(Setting.attributes, {
    sequelize,
    modelName: 'Setting',
  });
  return Setting;
};