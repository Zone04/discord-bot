'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReactionRoleMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ReactionRoleMessage.hasMany(models.ReactionRoleEmoji, {
        foreignKey: {
          name: 'rrId',
          allowNull: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      models.ReactionRoleMessage.hasMany(models.ReactionRoleIgnore, {
        foreignKey: {
          name: 'rrId',
          allowNull: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  ReactionRoleMessage.init({
    chanId: DataTypes.STRING,
    messageId: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: ['single', 'multiple'],
    }
  }, {
    sequelize,
    modelName: 'ReactionRoleMessage',
  });
  return ReactionRoleMessage;
};