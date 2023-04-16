'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Rider}) {
      // this.hasOne(vehicle, { foreignKey:'user_email', onDelete:'CASCADE'})
      User.hasOne(Rider, {onDelete:'CASCADE', onUpdate:'CASCADE'})
      Rider.belongsTo(User)
      // User.hasOne(Customer, { foreignKey:'user_email', onDelete:'CASCADE'})
      // Customer.belongsTo(User, { foreignKey:'user_email', onDelete:'CASCADE', onUpdate:'CASCADE'})
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey:true
    },
    fullName:{
      type:DataTypes.STRING,
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        isEmail:true,
      }
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    contactNo:{
      type:DataTypes.STRING,
    },
    CNIC:{
      type:DataTypes.STRING,
    },
    gender:{
      type:DataTypes.STRING,
    },
    userType:{
      type:DataTypes.STRING,
    },
    address:{
      type:DataTypes.STRING,
    },
    wayPoint1:{
      type:DataTypes.STRING
    },
    wayPoint2:{
      type:DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};