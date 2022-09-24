'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReactionRoleMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chanId: {
        type: Sequelize.STRING
      },
      messageId: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM,
        values: ['single', 'multiple']
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
      uniqueKeys: {
        rrM_unique: {
          fields: ['chanId', 'messageId']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReactionRoleMessages');
  }
};