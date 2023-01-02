'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Rider}) {
      vehicle.hasOne(Rider, { foreignKey:'vehicleId', onDelete:'CASCADE', onUpdate:'CASCADE'})
      Rider.belongsTo(vehicle)
    }
  }
  vehicle.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey:true
    },
    v_name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    v_number: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    v_type: {
      type:DataTypes.STRING,
      allowNull:false 
    },
    v_color: {
      type:DataTypes.STRING,
      allowNull:false 
    },
    noOfSeats: {
      type:DataTypes.INTEGER,
      allowNull:false 
    },
    availableSeats: {
      type:DataTypes.INTEGER,
      allowNull:true 
    },
    fuelAverage: {
      type:DataTypes.FLOAT,
      allowNull:false 
    },
  }, {
    sequelize,
    modelName: 'vehicle',
  });
  return vehicle;
};