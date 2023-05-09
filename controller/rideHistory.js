const { User , vehicle, Rider, Ride, RideRequest, RideHistory } = require('../models');
const  bcrypt  =  require("bcrypt");
const Sequelize = require('sequelize');
const {DataTypes,Op} = require('sequelize');

const inProgress = async(req, res) => {

    const {email} = req.query;

    const rideHistory = await RideHistory.findAll({where:{
        [Op.and]: [{RideStatus:"InProgress"}, {email:email}]
    }
    });

    if (rideHistory.length !== 0) {
        return res.status(200).json({
            data: rideHistory
        });
    }else{
        return res.status(404).json({
            "message":"Not Found"
        });                
    }
}

const completedRides = async(req, res) => {
 
    const {email} = req.query;

    const rideHistory = await RideHistory.findAll({where:{
        [Op.and]: [{RideStatus:"Completed"}, {email:email}]
    }
    });

    if (rideHistory.length !== 0) {
        return res.status(200).json({
            data: rideHistory
        });
    }else{
        return res.status(404).json({
            "message":"Not Found"
        });                
    }
    
}

const cancelledRides = async(req, res) => {
 
    const {email} = req.query;

    const rideHistory = await RideHistory.findAll({where:{
        [Op.and]: [{RideStatus:"Cancelled"}, {email:email}]
    }
    });

    if (rideHistory.length !== 0) {
        return res.status(200).json({
            data: rideHistory
        });
    }else{
        return res.status(404).json({
            "message":"Not Found"
        });                
    }
    
}

module.exports = {
    inProgress,
    completedRides,
    cancelledRides
}