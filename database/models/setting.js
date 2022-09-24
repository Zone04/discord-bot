'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    static attributes = {
      Spam: {
        easterProba: {
          type: DataTypes.FLOAT,
          set(value) {
            if (value > 1 || value < 0) { throw new Error('Unauthorized value'); }
            this.setDataValue('easterProba', value);
          },
          
          description: "Probabilité de l'easter egg",
        },
        spamLimit: {
          type: DataTypes.INTEGER,
          set(value) {
            if (parseInt(value) <= 0) { throw new Error('Unauthorized value'); }
            this.setDataValue('spamLimit', value);
          },
          description: "Taille maximale d'un spam",
        },
        logChanSpam: {
          type: DataTypes.STRING,
          set(value) {
            if (value == 'null') {value = null;}
            this.setDataValue('logChanSpam', value);
          },
          description: "ID du channel où log les spams",
        },
      },
      Admin:{
        logChan: {
          type: DataTypes.STRING,
          set(value) {
            if (value == 'null') {value = null;}
            this.setDataValue('logChan', value);
          },
          description: "ID du channel de logs pour le bot",
        },
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
  Setting.init(Object.assign({},...Object.keys(Setting.attributes).map(cat=>Setting.attributes[cat])), {
    sequelize,
    modelName: 'Setting',
  });
  return Setting;
};