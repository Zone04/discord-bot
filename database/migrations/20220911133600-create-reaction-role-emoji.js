'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReactionRoleEmojis', {
      rrId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'ReactionRoleMessages',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      roleId: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      emoji: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReactionRoleEmojis');
  }
};