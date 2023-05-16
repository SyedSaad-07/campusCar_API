const { User } = require('../models');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const {sendEmail} = require('./email');

// Signing Up a new User
const SignUp = async (req, res) => {

    const { email } = req.query;
    const fullName = '--'; const contactNo = '--'; const CNIC = '--'; const gender = '--'; const userType = '--'; const address = '--'; const wayPoint1 = '--'; const wayPoint2 = '--';
    try {
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            // res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({
                "message": "Email is already there, no need to register again."
            });

        } else {
            // const salt = await bcrypt.genSalt(10);
            // bcrypt.hash(pass, salt, async (error, data) => {
            // if(error){
            //     res.send(error);
            // }
            // else{
            const newUser = await User.create({ fullName, email: email, contactNo, CNIC, gender, userType, address, wayPoint1, wayPoint2 });
            await newUser.save();
            // }
            // })
            // res.setHeader('Content-Type', 'application/json');

            // usage
            const to = email;
            const subject = 'Account Created';
            const body = `Hello ${email} your account has been created!...`;
            await sendEmail(to, subject, body);

            return res.status(201).json({
                "authenticate": true
            });
        }

    } catch (error) {
        // res.setHeader('Content-Type', 'application/json');
        return res.status(500).jsonp({
            "error": "Internal Server error",
        });
    }
}


// Login an existing User
const Login = async (req, res) => {

    const { email, pass } = req.query;

    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({
                "message": "Email is not regstered",
            });
        }
        bcrypt.compare(pass, user.password,
            async (error, result) => {
                if (error) {
                    res.send(error);
                }
                if (!result)
                    return res.status(400).json({
                        "message": "Wrong password",
                    });

                if (result) {
                    return res.status(201).json({
                        "authenticate": true,
                    });
                }
            }
        );

    } catch (error) {
        return res.status(500).json({
            "error": "Internal Server error",
        });
    }

}

const showUserProfile = async (req, res) => {
    const { email } = req.query;

    const user = await User.findOne(
        {
            where: { email: email },
            attributes: { exclude: ['password'] }
        }
    );

    if (user) {
        return res.status(200).json({
            data: user
        });
    }
    return res.status(401).json({
        message: "User not present !"
    });
}

const updateUserProfile = async (req, res) => {
    const { name, gender, number, userType, CNIC, email } = req.query;

    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({
                "message": "Email is not regstered",
            });
        }
        await User.update({ fullName: name, gender: gender, contactNo: number, userType: userType, CNIC: CNIC },
            {
                where: {
                    email: email
                }, attributes: { exclude: ['password'] }
            });
        const updatedUser = await User.findOne({ where: { email: email } });

        await updatedUser.save();
        return res.status(201).json({
            data: updatedUser
        });

    } catch (error) {
        return res.status(401).json({ "status": "failed", "message": "Unauthorized User" })
    }
}


const resetPassword = async (req, res) => {
    const { email, newPass } = req.body;

    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({
                "message": "Email is not regstered",
            });
        }

        const salt = await bcrypt.genSalt(10);
        bcrypt.hash(newPass, salt, async (error, data) => {

            await User.update({ password: data },
                {
                    where: {
                        email: email
                    }
                });

        })

        var updatedUser = await User.findOne({ where: { email: email } });
        await updatedUser.save();

        // const updatedUser = await User.findOne({ where: { email: email } });
        // await updatedUser.save();
        return res.status(201).json({
            data: updatedUser
        });

    } catch (error) {
        return res.status(401).json({ "status": "failed", "message": "Unauthorized User" })
    }
}

module.exports = {
    SignUp,
    Login,
    showUserProfile,
    updateUserProfile,
    resetPassword
};