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
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_520_ci'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReactionRoleEmojis');
  }
};