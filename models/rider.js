'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Ride}) {
      Rider.hasMany(Ride,{onDelete:'CASCADE', onUpdate:'CASCADE'})
      // define association here
    }
  }
  Rider.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Rider',
  });
  return Rider;
};