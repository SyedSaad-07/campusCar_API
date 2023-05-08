const express = require("express");
const router = express.Router();

const {inProgress, completedRides, cancelledRides} = require("../controller/rideHistory");
router.get('/getAllinProgressRides',inProgress);
router.get('/getAllCompletedRides',completedRides);
router.get("/getAllCancelledRides",cancelledRides)
module.exports = router;