const express = require("express");
const router = express.Router();

const {inProgress, completedRides, cancelledRides, moreInfo, moreInfoForPartner, riderInfo} = require("../controller/rideHistory");

router.get('/getAllinProgressRides',inProgress);
router.get('/getAllCompletedRides',completedRides);
router.get("/getAllCancelledRides",cancelledRides);
router.get("/moreInfo",moreInfo);
router.get("/moreInfoForPartner",moreInfoForPartner);
router.get("/riderInfo",riderInfo);
module.exports = router;