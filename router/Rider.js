const express = require("express");
const router = express.Router();

const {showRiderProfile, addVehicle, updateRiderProfile, deleteRide, offerRide, getAllRides} = require("../controller/Rider");

router.get("/showRiderProfile",showRiderProfile);
router.post("/addVehicle",addVehicle);
router.patch("/updateRiderProfile",updateRiderProfile);
router.delete("/deleteRide",deleteRide);
router.post("/offerRide",offerRide);
router.get("/getAllRides",getAllRides);

module.exports = router;