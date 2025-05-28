'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('AutoReplies', 'message', {
          type: Sequelize.STRING(2000),
          allowNull: true,
        }, {
          transaction: t,
        })
      ])
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('AutoReplies', 'message', {
          type: Sequelize.STRING,
          allowNull: true,
        }, {
          transaction: t,
        })
      ])
    });
  }
};
