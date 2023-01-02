'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Riders','UserId',{
        type: Sequelize.INTEGER,
        references:{
          model:'Users',
          key:'id',
        },
        autoIncrement:false
      }),
      queryInterface.addColumn('Riders','vehicleId',{
        type: Sequelize.INTEGER,
        references:{
          model:'vehicles',
          key:'id',
        },
        autoIncrement:false
      })
    ])
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
