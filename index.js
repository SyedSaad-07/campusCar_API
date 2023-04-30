const express = require("express");
// const { Sequelize, QueryTypes, where } = require('sequelize');
const sequelize = require('./database/db');
const { User, vehicle, Rider, Ride, RideRequest } = require('./models');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
dotenv.config();

// npm install -g npm@9.1.3 to update!
const app = express();
const port = process.env.PORT || 8080;
const userRoutes = require("./router/User");
const riderRoutes = require("./router/Rider");
const rideHistory = require("./router/rideHistory");

// const limiter = rateLimit({
//     windowMs: 1 * 60 * 1000, // 15 minutes
//     max: 10 // limit each IP to 100 requests per windowMs
//   });
  
// app.use(limiter);

app.use(cors());
app.use(bodyParser.json())
app.use(express.json());
// app.post('/signup', async(req, res) => {
// // const SignUp = async(req, res) => {
//     const {email, pass} = req.body;

//     try {
//             const user = await User.findOne({ where: { email:email } });
//             if(user){
//                 return res.status(400).json({
//                     "message" : "Email is already there, no need to register again."
//                 });
//             }else{
//                 const salt = await bcrypt.genSalt(10);
//                 bcrypt.hash(pass, salt, async (error, data) => {
//                     if(error){
//                         res.send(error);
//                     }else{
//                         const newUser = await User.create({email:email, password: data });
//                         await newUser.save();
//                         console.log("Added")
//                     }
//                 })

//                 return res.status(201).json({
//                 "authenticate" : true
//             });
//             // res.setHeader('Content-Type', 'application/json');
//         }
     
//     } catch (error) {
//         return res.status(500).json({
//             "error" : "Internal Server error",
//         });
//     }   
// })

app.use("/userapi", userRoutes);
app.use("/riderapi", riderRoutes);
app.use("/rideHistory",rideHistory);

app.listen(port, async () => {
    await sequelize.authenticate()
    console.log('Database Connected!');
    console.log(`Server running on PORT ${port}!`);
})