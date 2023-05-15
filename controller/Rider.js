const { User , vehicle, Rider, Ride, RideRequest, RideHistory, Negotiation } = require('../models');
const  bcrypt  =  require("bcrypt");
const Sequelize = require('sequelize');
const {DataTypes,Op} = require('sequelize');
const {sendEmail} = require('./email');

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

        await User.update({userType:"Rider"},{ where: { email: email } });

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

        await User.update({userType:"Rider"},{ where: { email: email } });

        const rideHistory = await RideHistory.create({email: email, fullName: user.fullName, contactNo: user.contactNo, vehicle: vehicleData.v_number, vehicleType:vehicleData.v_type, sourceAddress:pickUpAdd, destinationAddress: dropOffAdd, dateTime: time,rideAction:'offered Ride', RideStatus:'InProgress',RideId:curr_Ride.id, fare: fair});
        await rideHistory.save();

        return res.status(200).json({
            data:curr_Ride
        });
            
    } catch (error) {
        return res.status(500).send({
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
        return res.status(500).send({
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
 
         if (user.contactNo  === "--" || user.CNIC  === "--") {
             return res.status(400).json({
                 "message" : "Try to complete your User profile first.",
             });
         }
 
         await User.update({userType:"Passenger"},{ where: { email: email } });
 
         const updatedUser = await User.findOne({ where: { email: email } });
         await updatedUser.save();


        //  const requestedRide = await RideRequest.create({RideId: id,UserId:user.id});
        //  await requestedRide.save();

         const findRide = await Ride.findOne({where:{id:id}});

         if (!findRide) {
            return res.status(404).json({
                "message":"Ride Doesn't exist"
            })
         }
         
         const requestedRide = await RideRequest.create({RideId: id,UserId:user.id, Accepted_fare: findRide.fair});
         await requestedRide.save();
         
         let seat = findRide.availableSeats - 1;

        await Ride.update({ availableSeats: seat},{
            where:{
                id: id
            },
        });
        
        await findRide.save();
        const isPresent = await Rider.findOne({where: {id:findRide.RiderId}});
        const vehicleData = await vehicle.findOne({where: {id: isPresent.vehicleId}});

        const rideHistory = await RideHistory.create({email: email, fullName: user.fullName, contactNo: user.contactNo, vehicle: vehicleData.v_number, vehicleType:vehicleData.v_type, sourceAddress:findRide.pickUpAddres, destinationAddress: findRide.dropOfAddress, dateTime: findRide.dateTime, RideStatus:'InProgress',rideAction:'booked Ride',RideId:findRide.id, fare: findRide.fair});
        await rideHistory.save();

        const findUserid = await Rider.findOne({where:{
            id: findRide.RiderId
        }});
        const userData = await User.findOne({where:{
            id: findUserid.UserId
        }})

        const toEmail = userData.email;
        const toname = userData.fullName;
        const name = user.fullName;
        const number = user.contactNo;
         // usage
         const to = toEmail;
         const subject = `${name} booked Ride with you`;
         const body = `Hello ${toname} - ${name} booked Ride with you, his/her contact number is ${number} try to connect. !...`;
         await sendEmail(to, subject, body);
 
        return res.status(200).json({
             'message':'Ride request is successfully Done!'
         })
 
     } catch (error) {
         res.status(500).json({
            "status":error
        });    
     }
 
}

const getAllRides = async(req, res) => {


    try {
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
        
    } catch (error) {
        return res.status(500).json({
            "error" : error,
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
    return res.status(200).json({
        data:allRides
    })

}

const rideCompletion = async(req, res) => {
    
    const {email, id} = req.query;

    try {
        const user = await User.findOne({ where: { email: email } });
        if(!user){
            return res.status(401).json({
                "message" : "Email is not regstered"
            })
        }
        const findRider = await Rider.findOne({ where: { UserId: user.id } });

        if (!findRider) {
            return res.status(400).json({
                "message" : "Rider doesn't Exist",
            });
        }

        const findRide = await Ride.findOne({where: {RiderId:findRider.id, id:id}});
        if (!findRide) {
            return res.status(400).json({
                "message" : "Ride doesn't Exist",
            });
        }

        if(findRide.Status === "Completed"){
            return res.status(400).json({
                "message" : "Ride already Completed",
            });
        }

        const allRideRequest = await RideRequest.findAll({where: {RideId:findRide.id}});

        for (let i = 0; i < allRideRequest.length; i++) {
            await RideRequest.update({bookingStatus:"Completed"},{where: {RideId:findRide.id}})
        }

        await Ride.update({Status:"Completed"},{where: {RiderId:findRider.id, id:id}});

        const allRideHis = await RideHistory.findAll({where: {RideId:findRide.id}});

        for (let i = 0; i < allRideRequest.length; i++) {
            await RideHistory.update({RideStatus:"Completed"},{where: {RideId:findRide.id}})
        }

        return res.status(200).json({
            message:'Ride Completed'
        })

    } catch (error) {
        return res.status(500).json({
            "error" : error,
        });
    }
    
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

        if(findRide.Status === "Cancelled"){
            return res.status(400).json({
                "message" : "Ride already Cancelled",
            });
        }

        const allRideRequest = await RideRequest.findAll({where: {RideId:findRide.id}});

        for (let i = 0; i < allRideRequest.length; i++) {
            await RideRequest.update({bookingStatus:"Cancelled by Rider"},{where: {RideId:findRide.id}})
        }

        await Ride.update({Status:"Cancelled"},{where: {RiderId:toDeleteRider.id, id:id}});
        
        const allRideHis = await RideHistory.findAll({where: {RideId:findRide.id}});

        for (let i = 0; i < allRideHis.length; i++) {
            await RideHistory.update({RideStatus:"Cancelled"},{where: {RideId:findRide.id}})
        }

        return res.status(200).json({
            "message" : "Ride Deleted Successfully",
        });

    } catch (error) {
        return res.status(500).json({
            "error" : error,
        });
    }
    
}

const deleteRideByUser = async(req,res) => {

    const {email, id} = req.query;
    try {

        const user = await User.findOne({ where: { email: email } });
        if(!user){
            return res.status(401).json({
                "message" : "Email is not regstered"
            })
        }
        const alreadyCan = await RideRequest.findOne({ where: {UserId:user.id, RideId:id}});
        if (!alreadyCan) {
            return res.status(400).json({
                "message" : "Ride doesn't exist",
            });
        }
        if (alreadyCan.bookingStatus === "Cancelled By Passenger") {
            return res.status(400).json({
                "message" : "Ride already Cancelled",
            });
        }

        const findUserInReq = await RideRequest.findOne({ where: {UserId:user.id, bookingStatus:"Pending", RideId:id}});
        if (findUserInReq) {

            await RideRequest.update({bookingStatus:"Cancelled By Passenger"},{ where: {UserId:user.id, bookingStatus:"Pending", RideId:id}});
            
            await RideHistory.update( {RideStatus:"Cancelled"}, {where: {
                [Op.and]:[{
                    email:email,
                    RideId:id,
                    rideAction:"booked Ride"
                }]
            }});

            const findRide = await Ride.findOne({where:{id:id}});
         
            let seat = findRide.availableSeats + 1 ;

            await Ride.update({ availableSeats: seat},{
                where:{
                    id: id
                },
            });

            return res.status(200).json({
                "message": "Ride Cancelled Successfully"
            })    
        }
        else{
            return res.status(400).json({
                "message": "Ride doesn't exist"
            })
        }

    } catch (error) {
        return res.status(500).json({
            "message":error
        })        
    }
}

const checkCompletedBookRide = async(req, res) => {
    const {email, id} = req.query;

    try {
        const user = await User.findOne({ where: { email: email } });
         if(!user){
             return res.status(401).json({
                 "message" : "Email is not regstered"
             })
         }

         const findRide = await Ride.findOne({where: {id:id}});

        if (!findRide) {
            return res.status(400).json({
                "message" : "Ride doesn't Exist",
            });
        }

         const findIfExist = await RideRequest.findOne({ where: {UserId:user.id,RideId:id}});
         const findUserInReqPending = await RideRequest.findOne({ where: {UserId:user.id, bookingStatus:"Pending", RideId:id}});
         const findUserInReqComp = await RideRequest.findOne({ where: {UserId:user.id, bookingStatus:"Completed", RideId:id}});
         const findUserInCanReq = await RideRequest.findOne({ where: {UserId:user.id,bookingStatus:"Cancelled By Passenger", RideId:id}});
 
         if (findIfExist) {
            if (findUserInReqPending || findUserInReqComp) {
                return res.status(400).json({
                    authentication:false
                })
             }else if (findUserInCanReq) {
                return res.status(200).json({
                    authentication:true
                })
             }
         }else{
            return res.status(200).json({
                authentication:true
            })
         }
        
    } catch (error) {
        return res.status(500).json({
            "message":error
        })
    }
}

const fareNegotiate = async(req, res) => {
    const {id, email, fare} = req.query;

    try {
        const user = await User.findOne({ where: { email: email } });
         if(!user){
             return res.status(401).json({
                 "message" : "Email is not regstered"
             })
         }
 
         if (user.contactNo  === "--" || user.CNIC  === "--") {
             return res.status(400).json({
                 "message" : "Try to complete your User profile first.",
             });
         }

        const findNeg = await Negotiation.findOne({where: {email: email, Status:'Pending',RideId: id}});
        if (findNeg) {
            return res.status(400).json({
                authentication: false
             })
        }

        const negotiate = await Negotiation.create({email: email, fullName: user.fullName, contactNo: user.contactNo, fare: fare, RideId: id, Status:'Pending'});
        negotiate.save();

         return res.status(200).json({
            authentication: true
         })

    } catch (error) {
        return res.status(500).json({
            "message":error
        })
    }
}

const getFareNegotiation = async(req, res) => {
    
    const {id} = req.query;
    try {        
        const allNegotiationRide = await Negotiation.findAll({where:{RideId: id}});
        return res.status(200).json({
            data: allNegotiationRide
        })

    } catch (error) {
        return res.status(500).json({
            "message":error
        })
    }
    
}

const acceptFare = async(req, res) => {
    
    const {id, email} = req.query;
    try {
        await Negotiation.update({Status: 'Accepted'},{
            where:{
                RideId: id,
                email : email
            },
        })
        return res.status(200).json({
            "message": "accepted"
        })
    } catch (error) {
        return res.status(500).json({
            "message": error
        })
    }
}

const rejectFare = async(req, res) => {
    
    const {id, email} = req.query;
    try {
        await Negotiation.update({Status: 'Rejected'},{
            where:{
                RideId: id,
                email : email
            },
        })
        return res.status(200).json({
            "message": "Rejected"
        })
    } catch (error) {
        return res.status(500).json({
            "message": error
        })
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
    checkCompleteRide,
    deleteRideByUser,
    checkCompletedBookRide,
    fareNegotiate,
    getFareNegotiation,
    acceptFare,
    rejectFare
};