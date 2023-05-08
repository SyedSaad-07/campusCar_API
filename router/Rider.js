const express = require("express");
const router = express.Router();

const {showRiderProfile, addVehicle, updateRiderProfile, deleteRide, offerRide, getAllRides, bookRide, myRides,rideCompletion, checkCompleteRide, deleteRideByUser, checkCompletedBookRide} = require("../controller/Rider");

router.get("/showRiderProfile/",showRiderProfile);
router.post("/addVehicle/",addVehicle);
router.patch("/updateRiderProfile",updateRiderProfile);
router.patch("/deleteRide",deleteRide);
router.post("/offerRide/",offerRide);
router.get("/getAllRides",getAllRides);
router.post("/bookRide",bookRide);
router.get("/myRides",myRides);
router.patch("/completeRide",rideCompletion);
router.get("/checkCompleteRide",checkCompleteRide);
router.patch("/deleteRideByUser",deleteRideByUser);
router.get("/checkCompletedBookRide",checkCompletedBookRide);
module.exports = router;