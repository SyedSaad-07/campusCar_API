'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Users','address',{
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Users','wayPoint1',{
        type:Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.addColumn('Users','wayPoint2',{
        type:Sequelize.STRING,
        allowNull:true
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