'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReactionRoleEmoji extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ReactionRoleEmoji.belongsTo(models.ReactionRoleMessage, {
        foreignKey: {
          name: 'rrId',
          allowNull: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  ReactionRoleEmoji.init({
    rrId: {type: DataTypes.INTEGER, primaryKey: true},
    roleId: {type: DataTypes.STRING},
    emoji: {type: DataTypes.STRING, primaryKey: true}
  }, {
    sequelize,
    modelName: 'ReactionRoleEmoji',
  });
  return ReactionRoleEmoji;
};