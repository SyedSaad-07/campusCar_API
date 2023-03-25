const express = require("express");
const router = express.Router();

const {showRiderProfile, addVehicle, updateRiderProfile, deleteRide, offerRide, getAllRides, bookRide, myRides} = require("../controller/Rider");

router.get("/showRiderProfile/",showRiderProfile);
router.post("/addVehicle/",addVehicle);
router.patch("/updateRiderProfile",updateRiderProfile);
router.delete("/deleteRide",deleteRide);
router.post("/offerRide/",offerRide);
router.get("/getAllRides",getAllRides);
router.post("/bookRide",bookRide);
router.get("/myRides",myRides)
module.exports = router;