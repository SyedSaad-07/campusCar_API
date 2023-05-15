'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Negotiation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Negotiation.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey:true
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull:false
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull:false
    },
    fare: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    RideId: {
      type: DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Negotiation',
  });
  return Negotiation;
};