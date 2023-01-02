'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey:true
      },
      v_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      v_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      v_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      v_color: {
        allowNull: false,
        type: Sequelize.STRING
      },
      noOfSeats: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      availableSeats: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      fuelAverage: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehicles');
  }
};