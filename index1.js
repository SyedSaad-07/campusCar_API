const express = require("express");
const { Sequelize, QueryTypes, where } = require('sequelize');
const sequelize = require('./database/db');
const { User, vehicle, Rider, Ride, RideRequest } = require('./models');
// const {User, vehicle, Rider} = require('./models/sequelize/index.js')
const jwt = require('jsonwebtoken');
const  bcrypt  =  require("bcrypt");
const getAuth = require("firebase/auth")
// const EmailValidator = require("email-validator");
// const checkUserAuth = require("./src/middleware/auth");

const app = express();
app.use(express.json());

// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize('campuscar-karRideAraamSay','postgres','admin', {
//     host: 'localhost',
//     dialect:  'postgres',
//     define: {
//         freezeTableName: true,
//         underscored: true,
//         createdAt: 'created_at',
//         updatedAt: 'updated_at',
//       }
// });

// const router = express.Router();

app.get('/', async(req, res) => {

    const Btoken = req.headers["authorization"];
    if (typeof Btoken !== undefined) {
        req.token = Btoken;
        jwt.verify(req.token, "mykey", async (error,data) => {
            if (error) {
                res.send(error);
            }else{
                const users = await User.findOne({ where: { email: data.email } });
                // const users = await User.findAll();
                res.send(users);
            }
        });
    }
    
})


// Signing Up a new User
app.post('/signup', async(req, res) => {

    const {email, pass} = req.body;

    try {
        const regex = /^[k][0-9]{6}@nu.edu.pk$/;
        const validate = regex.test(email);
        // let validate = EmailValidator.validate(email);
        
        if(!validate){
            res.status(500).json({
                error: "Invalid Email"
            });
        }else{
            const user = await User.findOne({ where: { email:email } });
            if(user){
                res.status(400).json({
                    data:"Email is already there, no need to register again."
                });
            }else{
                const salt = await bcrypt.genSalt(10);
                bcrypt.hash(pass, salt, async (error, data) => {
                    if(error){
                        res.send(error);
                    }else{
                        const newUser = await User.create({email:email, password: data });
                        await newUser.save();
                    }
                })

                const token = await jwt.sign({email:email},"mykey", {
                expiresIn: 86400,
                });

                res.send({
                authenticate : true,
                // data:[newUser,token:token]
                token:token
            });
        }
        }
    } catch (error) {
        res.send(error);
    }
    
    
})


// Login an existing User
app.post('/login', async(req, res) => {

    const {email, pass} = req.body;

    try {
        const regex = /^[k][0-9]{6}@nu.edu.pk$/;
        const validate = regex.test(email);;
        if(!validate){
            res.json({
                error: "Email is not correct"
            });
        }else{            
            const user = await User.findOne({ where: { email:email } });
            if(!user){
                res.json({
                    error: "Email is not registered"
                })
            }
            bcrypt.compare(pass,user.password,
                async (error, result) => {
                    if(error){
                        res.send(error);
                    }
                    if(!result) return res.send("Invalid Password Authentication error! ");
                    if(result){
                        const token = await jwt.sign({email:email},"mykey", {
                            expiresIn: 86400,
                        });
                
                        res.send({
                            authenticate : true,
                        // data:[newUser,token:token]
                            token:token
                        });
                    }
                }
            );
        }

    } catch (error) {
        res.send(error);
    }
    
    
})


app.put('/updateProfile', async (req, res) => {
    
    // res.send(req.user);
    const {name,gender, number, userType} = req.body;
    const Btoken = req.headers["authorization"];

    try{
    jwt.verify(Btoken, "mykey", async (error,data) => {
        if (error) {
            res.send(error);
        }else{
            const user = await User.findOne({ where: { email: data.email } });
            if(!user){
                throw new Error();
            }
            await User.update({fullName:name, gender:gender, contactNo :number, userType:userType },
                {
                where: {
                  email: data.email
                }
              });
            const updatedUser = await User.findOne({ where: { email: data.email } });
            req.Btoken = Btoken;
            res.send(updatedUser);
        
        }
    });
    }catch(error){
        res.status(401).send({"status":"failed","message":"Unauthorized User"})
    }
    
    if(!Btoken){
        res.status(401).send({"status":"failed","message":"Unauthorized User, No token"})
    }

})


app.post('/addVehicle', async (req, res) => {
  
    
    const {v_name, v_number, v_type, v_color, noOfSeats, availableSeats, fuelAverage} = req.body;
    const Btoken = req.headers["authorization"];

    try{
    jwt.verify(Btoken, "mykey", async (error,data) => {
        if (error) {
            res.send(error);
        }else{
            const user = await User.findOne({ where: { email: data.email } });
            if(!user){
                throw new Error();
            }
            const isVehicle = await vehicle.findOne({ where: { v_number: v_number } })
            if (isVehicle) {
                return res.send({
                    message:"This Vehicle is already registered with some anOther ID"
                });
            }
            // const newString = user.email+v_number;
            // console.log(newString);

            // const newVehicle = await sequelize.query("SELECT v_number FROM vehicles join Riders on vehicles.v_number = Riders.vehicle_number where vehicles.v_number = Riders.vehicle_number",
            // { 
            //     replacements:{v_number:v_number},
                // type: QueryTypes.SELECT
            // }
            // );
            // console.log(newVehicle);

            // const newrider = await Rider.findOne({ where: { user_id: data.id } });
            // res.send({
            //     data:newrider.vehicle_number
            // })
            // console.log(newrider.vehicle_number);
            // const newVehicle = await vehicle.findOne({ where: { v_number: v_number } });
            // if (!newrider) {
                // throw new Error();
                const vehicleDetails = await vehicle.create({ v_name, v_number, v_type, v_color, noOfSeats, availableSeats, fuelAverage});
                console.log(user.id, vehicleDetails.id);
                // try {
                const riderDetails=  await Rider.create({UserId:user.id, vehicleId:vehicleDetails.id});    
                // } catch (error) {
                    // console.log(error);
                // }
                
                await vehicleDetails.save();
                await riderDetails.save();
            // }
            // else{
                // const newVehicle = await vehicle.findOne({ where: { v_number: newrider.vehicle_number } });
                // res.send({
                    // data:newVehicle
                // })

                // await vehicle.update({ v_name, v_number, v_type, v_color, noOfSeats, availableSeats, fuelAverage },{
                //     where:{
                //         v_number: newrider.vehicle_number
                //     },
                //     include:[Rider]
                // });

                // await Rider.update({vehicle_number:v_number, rider_identity:newString},{
                    // where:{
                        // user_email: newrider.user_email
                    // },
                    // include:[vehicle]
                // });
                

                // // const vehicleDetail = await vehicle.findOne({ where: { v_number: v_number } });
                
            // }
            // vehicleDetails = await vehicle.findOne({ where: { v_number: v_number } });
            // riderDetails = await Rider.findOne({ where: { user_email: newrider.email } });
            // req.Btoken = Btoken;
            res.send({
                data:[vehicleDetails,riderDetails]
            });
 
        }
    });
    }catch(error){
        res.status(401).send({"status":"failed","message":"Unauthorized User"})
    }
    
    if(!Btoken){
        res.status(401).send({"status":"failed","message":"Unauthorized User, No token"})
    }

})


app.put('/updateVehicle', async(req, res) =>{

    const {v_name, v_number, v_type, v_color, noOfSeats, availableSeats, fuelAverage} = req.body;
    const Btoken = req.headers["authorization"];

    try{
    jwt.verify(Btoken, "mykey", async (error,data) => {
        if (error) {
            res.send(error);
        }else{
            const user = await User.findOne({ where: { email: data.email } });
            if(!user){
                throw new Error();
            }
            const isVehicle = await vehicle.findOne({ where: { v_number: v_number } })
            if (isVehicle) {
                return res.send({
                    message:"This Vehicle is already registered with some anOther ID"
                });
            }

            const newrider = await Rider.findOne({ where: { UserId: user.id } });
            if (!newrider) {
                // var vehicleDetails = await vehicle.create({ v_name, v_number, v_type, v_color, noOfSeats, availableSeats, fuelAverage});
                // var riderDetails = await Rider.create({user_email:user.email, vehicle_number:vehicleDetails.v_number, rider_identity:newString});
            }
            else{
                await vehicle.update({ v_name, v_number, v_type, v_color, noOfSeats, availableSeats, fuelAverage },{
                    where:{
                        id: newrider.vehicleId
                    },
                });

            }
            vehicleDetails = await vehicle.findOne({ where: { v_number: v_number } });
            riderDetails = await Rider.findOne({ where: { vehicleId: vehicleDetails.id } });
            req.Btoken = Btoken;
            res.send({
                data:[vehicleDetails,riderDetails]
            });
 
        }
    }
    );
    }catch(error){
        res.status(401).send({"status":"failed","message":"Unauthorized User"})
    }
    
    if(!Btoken){
        res.status(401).send({"status":"failed","message":"Unauthorized User, No token"})
    }

})

app.post('/offerRide', async(req, res) => {

    const {pickUpAdd, dropOffAdd, description, fair,time} = req.body;
    if (pickUpAdd==dropOffAdd) {
        return res.send({
            message:"Your DropOff location is same as PickUp Location, try to write different."
        })
    }

    const Btoken = req.headers["authorization"];

    try {
        jwt.verify(Btoken,"mykey", async(error, data)=> {
            if (error) {
                res.send(error);
            } else {
                const user = await User.findOne({ where: { email: data.email } });
            if(!user){
                throw new Error();
            }
            const isPresent = await Rider.findOne({where: {UserId:user.id}})
            if (!isPresent) {
                res.send("You are not registered as a Rider");
            }

            const curr_Ride = await Ride.create({pickUpAddres:pickUpAdd, dropOfAddress:dropOffAdd, description:description, fair:fair, dateTime:time, RiderId:isPresent.id});
            res.send({
                data:curr_Ride
            })
            }
        })
    } catch (error) {
        
    }

})

app.post('/rideRequest', async(req, res) => {

    // const {pickUpAdd, dropOffAdd, description, fair,time} = req.body;

    const Btoken = req.headers["authorization"];

    try {
        jwt.verify(Btoken,"mykey", async(error, data)=> {
            if (error) {
                res.send(error);
            } else {
                const user = await User.findOne({ where: { email: data.email } });
            if(!user){
                throw new Error();
            }

            const curr_RideRequest = await RideRequest.create({RideId:1});
            res.send({
                data:curr_RideRequest
            })
            }
        })
    } catch (error) {
        
    }

})

app.listen({ port: 5000 }, async () => {
    // console.log('Server up on http://localhost:5000')
    await sequelize.authenticate()
    console.log('Database Connected!');
    console.log('Server running on PORT 5000!');
})