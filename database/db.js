const {Sequelize} = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_ENVIRONMENT ,{
// const sequelize = new Sequelize(process.env.DATABASE_URL ,{
    //host: 'localhost',
    dialect:  'postgres',
    define: {
        freezeTableName: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
});

module.exports = sequelize;