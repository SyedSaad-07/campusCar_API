const express = require("express");
const router = express.Router();

const {inProgress, completedRides} = require("../controller/rideHistory");
router.get('/getAllinProgressRides',inProgress);
router.get('/getAllCompletedRides',completedRides);

module.exports = router;