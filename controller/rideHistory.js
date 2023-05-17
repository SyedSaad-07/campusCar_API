const { User , vehicle, Rider, Ride, RideRequest, RideHistory } = require('../models');
const {Op} = require('sequelize');

const riderInfo = async(req,res) =>{
    const {id} = req.query;
    try {
        const fromRide = await Ride.findOne({where:{
            id: id
        }})
        const Rid = fromRide.RiderId;

        const fromRider = await Rider.findOne({where: {
            id: Rid
        }})

        const Uid = fromRider.UserId;
        const userData = await User.findOne({
            where:{id:Uid},
            attributes:['email','fullName']
        })
        return res.status(200).json({
            data: userData,
        })
    } catch (error) {
        return res.status(500).json({
            "message": error
        })
    }
}

const inProgress = async(req, res) => {

    const {email} = req.query;

    try {
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
    } catch (error) {
        return res.status(500).json({
            "message":error
        })
    }
   
}

const completedRides = async(req, res) => {
 
    const {email} = req.query;

    try {

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
        
    } catch (error) {
        return res.status(500).json({
            "message":error
        })
    }
    
}

const cancelledRides = async(req, res) => {
 
    const {email} = req.query;
    
    try {

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
        
    } catch (error) {
        return res.status(500).json({
            "message":error
        })
    }
    
}

const moreInfo = async(req, res) => {

    const {email, id} = req.query;

    try {    
        const rideHistoryOfPartner = await RideHistory.findAll({where:{
            [Op.and]: [{RideStatus:"InProgress"}, {rideAction:"booked Ride"}, {RideId:id}]
        }
        });
        if (rideHistoryOfPartner.length !== 0) {
            return res.status(200).json({
                rideHistoryOfPartner
            })

        }else{
            return res.status(404).json({
                "message":"Not Found"
            });   
        }

    } catch (error) {
        return res.status(500).json({
            "message":error
        })        
    }

    // const response = await axios.get("http://localhost:5000/rideHistory/getAllinProgressRides/?email=k190338@nu.edu.pk");
    // const statusCode = response.status;
    // const gotRes = response.data.data;

    // return res.status(200).json({
    //     statusCode,
    //     gotRes,
    //     "message":"OK"
    // })
}

const moreInfoForPartner = async(req, res) => {

    const {email, id} = req.query;

    try {    
        const rideHistoryOfPartner = await RideHistory.findOne({where:{
            [Op.and]: [{RideStatus:"InProgress"}, {rideAction:"offered Ride"},{RideId:id}]
        }

        });

        if (rideHistoryOfPartner.length !== 0) {
            return res.status(200).json({
                rideHistoryOfPartner
            })

        }else{
            return res.status(404).json({
                "message":"Not Found"
            });   
        }

    } catch (error) {
        return res.status(500).json({
            "message":error
        })        
    }

    // const response = await axios.get("http://localhost:5000/rideHistory/getAllinProgressRides/?email=k190338@nu.edu.pk");
    // const statusCode = response.status;
    // const gotRes = response.data.data;

    // return res.status(200).json({
    //     statusCode,
    //     gotRes,
    //     "message":"OK"
    // })
}


module.exports = {
    inProgress,
    completedRides,
    cancelledRides,
    moreInfo,
    moreInfoForPartner,
    riderInfo
}