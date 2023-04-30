const { User , vehicle, Rider, Ride, RideRequest, RideHistory } = require('../models');
const  bcrypt  =  require("bcrypt");
const Sequelize = require('sequelize');
const {DataTypes,Op} = require('sequelize');

const inProgress = async(req, res) => {

    const {email} = req.query;

    const rideHistory = await RideHistory.findAll({where:{RideStatus:"inProgress", email:email}});
    return res.status(200).json({
        data: rideHistory
    });
}

const completedRides = async(req, res) => {
 
    const {email} = req.query;
 
    const rideHistory = await RideHistory.findAll({where:{RideStatus:"Completed", email:email}});
    return res.status(200).json({
        data: rideHistory
    });
}

module.exports = {
    inProgress,
    completedRides
}