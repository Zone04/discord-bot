'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('AutoPings', 'guild', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.renameTable('AutoPings', 'AutoReplies', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.renameTable('AutoReplies', 'AutoPings', { transaction: t }),
        queryInterface.removeColumn('AutoPings', 'guild', { transaction: t })
      ]);
    });
  }
};
