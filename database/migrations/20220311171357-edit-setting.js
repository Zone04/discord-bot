'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Settings', 'logChan', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Settings', 'easterProba', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Settings', 'logChan', { transaction: t }),
        queryInterface.removeColumn('Settings', 'easterProba', { transaction: t })
      ]);
    });
  }
};
