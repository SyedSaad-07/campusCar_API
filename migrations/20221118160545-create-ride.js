'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rides', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pickUpAddres: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dropOfAddress: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      fair: {
        type: Sequelize.INTEGER
      },
      dateTime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      RiderId:{
        type: Sequelize.INTEGER,
        references:{
          model:'Riders',
          key:'id',
        },
        autoIncrement:false
      },
      createdAt:{
        type: Sequelize.DATE,
        allowNull:false
      },
      updatedAt:{
        type: Sequelize.DATE,
        allowNull:false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rides');
  }
};