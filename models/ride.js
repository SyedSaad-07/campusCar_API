'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ride extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Rider, RideRequest}) {
      Ride.belongsTo(Rider,{onDelete:'CASCADE', onUpdate:'CASCADE'})
      Ride.hasMany(RideRequest,{onDelete:'CASCADE', onUpdate:'CASCADE'})
      RideRequest.belongsTo(Ride)
      // define association here
    }
  }
  Ride.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    pickUpAddres: {
      allowNull: false,
      type: DataTypes.STRING
    },
    dropOfAddress: {
      allowNull: false,
      type: DataTypes.STRING
    },
    fair: {
      type: DataTypes.INTEGER
    },
    dateTime: {
      allowNull: false,
      type: DataTypes.DATE
    },
    Status:{
      type: DataTypes.STRING,
      defaultValue:'Not Completed',
      allowNull:false
    },
    wayPoint1:{
      allowNull: true,
      type: DataTypes.STRING
    },
    wayPoint2:{
      allowNull: true,
      type: DataTypes.STRING
    },
    availableSeats:{
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Ride',
  });
  return Ride;
};