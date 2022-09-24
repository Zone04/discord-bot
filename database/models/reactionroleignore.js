'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReactionRoleIgnore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ReactionRoleIgnore.belongsTo(models.ReactionRoleMessage, {
        foreignKey: {
          name: 'rrId',
          allowNull: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  ReactionRoleIgnore.init({
    userId: {type: DataTypes.STRING, primaryKey: true},
    rrId: {type: DataTypes.INTEGER, primaryKey: true}
  }, {
    sequelize,
    modelName: 'ReactionRoleIgnore',
  });
  return ReactionRoleIgnore;
};