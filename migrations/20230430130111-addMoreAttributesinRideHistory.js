'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('RideHistories','vehicle',{
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('RideHistories','vehicleType',{
        type:Sequelize.STRING,
        allowNull:false
      }),
      queryInterface.addColumn('RideHistories','sourceAddress',{
        type:Sequelize.STRING,
        allowNull:false
      }),
      queryInterface.addColumn('RideHistories','destinationAddress',{
        type:Sequelize.STRING,
        allowNull:false
      }),
      queryInterface.addColumn('RideHistories','dateTime',{
        type:Sequelize.DATE,
        allowNull:false
      }),
      queryInterface.addColumn('RideHistories','RideStatus',{
        type:Sequelize.STRING,
        allowNull:false
      }),
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
