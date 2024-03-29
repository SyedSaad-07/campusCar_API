'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RideRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RideRequest.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    bookingStatus:{
      type: DataTypes.STRING,
        defaultValue:'Pending',
        allowNull:false
    },
    UserId:{
      type: DataTypes.INTEGER,
      autoIncrement:false
    },
    Accepted_fare:{
      type: DataTypes.STRING,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'RideRequest',
  });
  return RideRequest;
};