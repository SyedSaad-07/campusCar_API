'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      Customer.belongsTo(User, { onDelete:'CASCADE', onUpdate:'CASCADE'})
      // define association here
    }
  }
  Customer.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};