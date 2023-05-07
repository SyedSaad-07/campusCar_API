const { User , vehicle, Rider, Ride, RideRequest, RideHistory } = require('../models');
const  bcrypt  =  require("bcrypt");
const Sequelize = require('sequelize');
const {DataTypes,Op} = require('sequelize');

// app.get('/showRiderProfile', async(req, res) => {
const showRiderProfile = async(req, res) => {

    const {email} = req.query;          
    const user = await User.findOne({ where: { email: email } });

    const showRider = await Rider.findOne({ where: { UserId: user.id } });
        if(!showRider){
            return res.status(401).json({
                data: null,
                "message" : "Not Registered as Rider",
            });
        }
        else{
            // const showVehicle = await vehicle.findOne({ where: { id: showRider.vehicleId, UserId: user.id } })
            const showVehicle = await vehicle.findOne({ where: { id: showRider.vehicleId } })

        const riderdata = await Rider.findOne({
            where:{vehicleId: showVehicle.id},
            attributes: ['id', 'UserId', 'vehicleId'],
            include:[{
                model: vehicle,
                attributes: ['id','v_name', 'v_number', 'v_type','v_color','noOfSeats','fuelAverage']
            }],
        })
        return res.status(200).json({
            data: riderdata
        });
        }
}

// app.post('/addVehicle', async (req, res) => {
const addVehicle = async(req, res) => {

    const {email, v_name, v_number, v_type, v_color, noOfSeats, fuelAverage} = req.query;

    try{
            const user = await User.findOne({ where: { email: email } });
            if(!user){
                return res.status(401).json({
                    "message" : "Email is not regstered"
                })
            }

            if (user.contactNo == null || user.CNIC == null) {
                return res.status(400).json({
                    "message" : "Try to complete your User profile first.",
                });
            }
            
            const isVehicle = await vehicle.findOne({ where: { v_number: v_number } })
            if (isVehicle) {
                return res.status(400).json({
                    "message" : "This Vehicle is already registered by someone",
                });
                
            }
            const isExist = await Rider.findOne({ where: { UserId: user.id } })
            if (isExist) {
                return res.status(400).json({
                    "message" : "You Can't add more than 1 vehicle, update your details"
                })
            }
            const vehicleDetails = await vehicle.create({ v_name, v_number, v_type, v_color, noOfSeats, fuelAverage});

            const riderDetails=  await Rider.create({UserId:user.id, vehicleId:vehicleDetails.id});
            await User.update({userType:"Rider"},{ where: { email: email } });

            await vehicleDetails.save();
            await riderDetails.save();

            const updatedUser = await User.findOne({ where: { email: email } });
            await updatedUser.save();

            const details = await Rider.findOne({
                where:{vehicleId: vehicleDetails.id},
                attributes: ['id', 'UserId', 'vehicleId'],
                include:[{
                    model: vehicle,
                    attributes: ['id','v_name', 'v_number', 'v_type','v_color','noOfSeats','fuelAverage']
                }],
            })

            return res.status(200).json({
                data: details
            });

    }catch(error){
        return res.status(401).send({"status":"failed","message":"Unauthorized User"})
    }

}


// app.put('/updateRiderProfile', async(req, res) =>{
const updateRiderProfile = async(req, res) => {

    const {email,v_name, v_number, v_type, v_color, noOfSeats, fuelAverage} = req.query;

    try{
        const user = await User.findOne({ where: { email: email } });
        if(!user){
            return res.status(401).json({
                "message" : "Email is not regstered"
            })
        }

        if (user.contactNo == null || user.CNIC == null) {
            return res.status(400).json({
                "message" : "Try to complete your User profile first.",
            });
        }

        const isExist = await Rider.findOne({ where: { UserId: user.id } })
        if (!isExist) {
            return res.status(400).json({
                "message" : "First add your vehicle details before updation."
            })
        }



        const isVehicle = await vehicle.findOne({ where: { v_number: v_number } });
        // const isAlreadtThere = await Rider.findOne({ where: { vehicleId: isVehicle.id, UserId: user.id } });
        if (isVehicle) {
            return res.status(400).json({
                "message" : "This Vehicle is already registered by someone",
            });
        }

        // const newrider = await Rider.findOne({ where: { UserId: user.id } });
        // if (!newrider) {
        //     return res.status(400).json({
        //         "message" : "Data is null try to add data first",
        //     });
        // }
            
        await vehicle.update({ v_name, v_number, v_type, v_color, noOfSeats, fuelAverage },{
            where:{
                id: isExist.vehicleId
            },
        });    

        const vehicleDetails = await vehicle.findOne({ where: { v_number: v_number } });
        const riderDetails = await Rider.findOne({ where: { vehicleId: vehicleDetails.id } });
        
        await vehicleDetails.save();
        await riderDetails.save();

        const profile = await Rider.findOne({
            where:{vehicleId: vehicleDetails.id},
            attributes: ['id', 'UserId', 'vehicleId'],
            include:[{
                model: vehicle,
                attributes: ['id','v_name', 'v_number', 'v_type','v_color','noOfSeats','fuelAverage']
            }],
        })

        return res.status(200).json({
                data:profile
            });

    }catch(error){
        return res.status(401).send({"status":"failed","message":"Unauthorized User"})
    }

}


// app.post('/offerRide', async(req, res) => {
const offerRide = async(req, res) => {

    const {email, pickUpAdd, dropOffAdd, wayPoint1, wayPoint2, fair,time, availableSeats} = req.query;

    if (pickUpAdd == dropOffAdd) {
        return res.status(400).json({
            "message":"Your DropOff location is same as PickUp Location, try to write different."
        })
    }

    try {
        const user = await User.findOne({ where: { email: email } });
        
        if(!user){
            return res.status(401).json({
                "message" : "Email is not registered"
            })
        }

        else if (user.contactNo === "--" || user.CNIC === "--") {
            return res.status(400).json({
                "message" : "Try to complete your User profile first.",
            });
        }

        const isPresent = await Rider.findOne({where: {UserId:user.id}})
        if (!isPresent) {
            return res.status(401).json({"message":"You are not registered as a Rider, try to add Vehicle details first"});
        }

        // const findRide = await Ride.findOne({where:{RiderId:isPresent.id}});
        // if (findRide.Status=='Not Completed') {
        //     return res.status(400).json({
        //         "message" : "Try to complete your first ride before posting another.",
        //     });
        // }

        const curr_Ride = await Ride.create({pickUpAddres:pickUpAdd, dropOfAddress:dropOffAdd, fair:fair, dateTime:time, RiderId:isPresent.id, wayPoint1:wayPoint1, wayPoint2:wayPoint2,availableSeats:availableSeats});
        await curr_Ride.save();
        
        const vehicleData = await vehicle.findOne({where: {id: isPresent.vehicleId}});
        const rideHistory = await RideHistory.create({email: email, fullName: user.fullName, contactNo: user.contactNo, vehicle: vehicleData.v_number, vehicleType:vehicleData.v_type, sourceAddress:pickUpAdd, destinationAddress: dropOffAdd, dateTime: time,rideAction:'offered Ride', RideStatus:'inProgress'});
        await rideHistory.save();

        return res.status(200).json({
            data:curr_Ride
        });
            
    } catch (error) {
        res.status(500).send({
            "status":error
        })
        // res.status(500).send({"status":"failed","message":"Unauthorized Rider"})
    }
}

const checkCompleteRide = async(req, res) => {

    const {email, date} = req.query;

    try {
        const user = await User.findOne({ where: { email: email } });
        
        if(!user){
            return res.status(401).json({
                "message" : "Email is not registered"
            })
        }

        const isPresent = await Rider.findOne({where: {UserId:user.id}});
        if (!isPresent) {
            return res.status(401).json({"message":"You are not registered as a Rider, try to add Vehicle details first"});
        }

        const findRide = await Ride.findOne(
            {
                order: [['id', 'ASC']],
                attributes:[
                    'id',
                    'Status',
                    [Sequelize.fn('to_char', Sequelize.col('dateTime'), 'YYYY-MM-DD'), 'dateTimeString'],
                    // [Sequelize.fn(Sequelize.DATE, Sequelize.col("dateTime")),"date"], 
                ],
                where:{RiderId:isPresent.id, Status:'Not Completed'}
            }
            );

            const findAllRide = await Ride.findAll(
                {
                    order: [['id', 'ASC']],
                    attributes:[
                        'id',
                        'Status',
                        [Sequelize.fn('to_char', Sequelize.col('dateTime'), 'YYYY-MM-DD'), 'dateTimeString'],
                        // [Sequelize.fn(Sequelize.DATE, Sequelize.col("dateTime")),"date"], 
                    ],
                    where:{RiderId:isPresent.id, Status:'Not Completed'}
                }
                );

        // console.log(findAllRide);
        let count = 0;

        if(findRide !== null){
            findAllRide.forEach(ride => {

                if (findRide.Status == 'Not Completed' && date == ride.dataValues.dateTimeString) {
                    count = count + 1;
                }

            });
            if (count !== 0) {
                return res.status(400).json({
                    "authentication":false,
                });
            }
            
            else{
                return res.status(200).json({
                    "authentication":true
                })
            }
        }else{
            return res.status(200).json({
                "authentication":true,
            })
        }
        
    } catch (error) {
        res.status(500).send({
            "status":error
        })
    }
}

const bookRide = async(req, res) =>{
    const {id, email} = req.query;
 
    try {
 
     const user = await User.findOne({ where: { email: email } });
         if(!user){
             return res.status(401).json({
                 "message" : "Email is not regstered"
             })
         }
 
         if (user.contactNo == null || user.CNIC == null) {
             return res.status(400).json({
                 "message" : "Try to complete your User profile first.",
             });
         }
 
         await User.update({userType:"Passenger"},{ where: { email: email } });
 
         const updatedUser = await User.findOne({ where: { email: email } });
         await updatedUser.save();


         const requestedRide = await RideRequest.create({RideId: id});
         await requestedRide.save();

         const findRide = await Ride.findOne({where:{id:id}});
         let seat = findRide.availableSeats - 1;

        await Ride.update({ availableSeats: seat},{
            where:{
                id: id
            },
        });
        
        await findRide.save();
        const isPresent = await Rider.findOne({where: {id:findRide.RiderId}});
        const vehicleData = await vehicle.findOne({where: {id: isPresent.vehicleId}});

        const rideHistory = await RideHistory.create({email: email, fullName: user.fullName, contactNo: user.contactNo, vehicle: vehicleData.v_number, vehicleType:vehicleData.v_type, sourceAddress:findRide.pickUpAddres, destinationAddress: findRide.dropOfAddress, dateTime: findRide.dateTime, RideStatus:'inProgress',rideAction:'booked Ride'});
        await rideHistory.save();
 
        return res.status(200).json({
             'message':'Ride request is successfully Done!'
         })
 
     } catch (error) {
         res.status(500).json({"status":error});    
     }
 
}

const getAllRides = async(req, res) => {


    const rides = await Ride.findAll({
        where:{
            Status:'Not Completed',
            [Op.not]:[{availableSeats:0}]
        },
        attributes: [
            'id', 'pickUpAddres', 'dropOfAddress','fair','dateTime',
            [Sequelize.fn(Sequelize.DATE, Sequelize.col("dateTime")),"date"],
            //   "%d-%m-%Y %H:%i:%s"
            'RiderId','Status','wayPoint1','wayPoint2','availableSeats'
        ],
        include:[{
            model: Rider,
            attributes: ['id', 'UserId', 'vehicleId'],
            
            include:[{
                model:User,
                attributes: ['id','fullName', 'email', 'contactNo']
            }]

        }]
});


    if (rides) {
        return res.status(200).json({
            rides
        });
    }

    // res.status(401).json({
    //     message:"User not present !"
    // });
}

// ignore for NOW
const myRides = async(req, res) => {

    const allRides = await RideRequest.findAll({
        // attributes: { exclude: ['bookingStatus'] }
        // ['id',
        // 'createdAt',
        // 'updatedAt',
        // 'RiderId']
    });
    res.status(200).json({
        data:allRides
    })

}

const rideCompletion = async(req, res) => {
    
    const {email, id} = req.query;

    await Ride.update({ Status: 'Completed'},{
        where:{
            id: id
        },
    });
    const findRide = await Ride.findOne({where:{id:id}})
    findRide.save();
    res.status(200).json({
        message:'Ride Completed'
    })
}

const deleteRide = async(req, res) => {

    const {email,id} = req.query;

    try {
        const user = await User.findOne({ where: { email: email } });
        if(!user){
            return res.status(401).json({
                "message" : "Email is not regstered"
            })
        }
        const toDeleteRider = await Rider.findOne({ where: { UserId: user.id } });

        if (!toDeleteRider) {
            return res.status(400).json({
                "message" : "Rider doesn't Exist",
            });
        }

        const findRide = await Ride.findOne({where: {RiderId:toDeleteRider.id, id:id}});

        if (!findRide) {
            return res.status(400).json({
                "message" : "Ride doesn't Exist",
            });
        }

        const allRideRequest = await RideRequest.findAll({where: {RideId:findRide.id}});
        console.log(allRideRequest);

        for (let i = 0; i < allRideRequest.length; i++) {
            await RideRequest.update({bookingStatus:"Cancelled by Rider"},{where: {RideId:findRide.id}})
        }


        // const deleteRequest = await RideRequest.destroy({where: {RideId:toDeleteRider.id}})
        await Ride.update({Status:"Cancelled"},{where: {RiderId:toDeleteRider.id, id:id}});
        
        // await RideRequest.save();
        // await Ride.save();   

        return res.status(200).json({
            "message" : "Ride Deleted Successfully",
        });

    } catch (error) {
        return res.status(500).json({
            "error" : error,
        });
    }
    
}

module.exports = {
    showRiderProfile,
    addVehicle,
    updateRiderProfile,
    deleteRide,
    offerRide,
    getAllRides,
    bookRide,
    myRides,
    rideCompletion,
    checkCompleteRide
};