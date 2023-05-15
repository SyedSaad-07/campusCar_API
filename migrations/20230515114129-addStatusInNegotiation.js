'use strict';

const { promises } = require('nodemailer/lib/xoauth2');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Negotiations','Status',{
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Negotiations','Status',{
        type: Sequelize.STRING,
        allowNull: true
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
