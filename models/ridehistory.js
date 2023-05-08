'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RideHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RideHistory.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey:true
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    fullName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    contactNo: {
      allowNull: false,
      type: DataTypes.STRING
    },
    vehicle:{
      allowNull:false,
      type:DataTypes.STRING
    },
    vehicleType:{
      allowNull:false,
      type:DataTypes.STRING
    },
    sourceAddress:{
      allowNull:false,
      type:DataTypes.STRING
    },
    destinationAddress:{
      allowNull:false,
      type:DataTypes.STRING
    },
    dateTime: {
      allowNull: false,
      type: DataTypes.DATE
    },
    RideStatus:{
      allowNull:false,
      type:DataTypes.STRING
    },
    rideAction:{
      allowNull:true,
      type:DataTypes.STRING
    },
    RideId:{
      type:DataTypes.INTEGER,
      allowNull: true
    }    
  }, {
    sequelize,
    modelName: 'RideHistory',
  });
  return RideHistory;
};