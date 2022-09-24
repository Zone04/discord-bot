'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReactionRoleIgnores', {
      userId: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
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
    await queryInterface.dropTable('ReactionRoleIgnores');
  }
};