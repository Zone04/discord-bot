'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Settings', 'logChanSpam', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Settings', 'logChanSpam', { transaction: t })
      ]);
    });
  }
};
