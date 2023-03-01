const express = require("express");
const router = express.Router();

const { SignUp, Login, showUserProfile, updateUserProfile, resetPassword } = require("../controller/User");

router.post("/signup/",SignUp);
router.post("/login/",Login);
router.get("/showUserProfile",showUserProfile);
router.patch("/updateUserProfile",updateUserProfile);
router.patch("/resetPassword", resetPassword);

module.exports = router;