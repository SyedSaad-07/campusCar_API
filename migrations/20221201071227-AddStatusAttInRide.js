'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Rides','Status',{
        type: Sequelize.STRING,
        defaultValue:'Not Completed',
        allowNull:false
      }),
      queryInterface.removeColumn("vehicles","availableSeats"),
      queryInterface.addColumn("vehicles","availableSeats",{
      type: Sequelize.INTEGER,
      allowNull:true,
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
