const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const dotenv = require("dotenv").config({ path: "src/.env" });
const { sendEmail } = require("../utilities/functions");
const SECRET_KEY = process.env.SECRET_KEY;
const User = require("../Models/user.model");
const Portfolio=require("../Models/portfolio.model");

const newUser = async (req, res) => {
    try {
        const { username, email, password, mobile } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Please fill all details" });
        const user = new User(req.body);
        const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
            expiresIn: "1d",
        }); //generating jwt
        user.tokens = user.tokens.concat({ token }); //saving token in tokens field of db
        await user.save();
        //sending verification mail
        await sendEmail({
            emailId: email,
            subject: "Welcome to Organ Connect",
            message:
                "Account confirmation mail for your account on Organ Connect",
        });
        return res.status(200).json({ token: token, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password)
        return res.status(400).json({ message: "Please Fill the Details" });
    try {
        const userData = await User.findOne({ email: req.body.email });
        if (!userData) return res.status(400).json({ error: "User not found" });
        const validPassword = await bcrypt.compare(
            req.body.password,
            userData.password
        ); //comparing hashed password
        if (!userData || !validPassword)
            res.status(400).json({ error: "Invalid credentials" });
        else {
            const token = jwt.sign({ _id: userData._id }, SECRET_KEY, {
                expiresIn: "1d",
            }); //generating jwt
            userData.tokens = userData.tokens.concat({ token }); //saving token in tokens field of db
            await userData.save();

            return res.status(200).json({ token: token, userData });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const user = req.user;
        const tkn = req.header("AuthenticateUser").split(" ")[1];
        //removing the logged in token from db
        user.tokens = user.tokens.filter((token) => {
            return token.token != tkn;
        });
        await user.save();
        res.status(200).json({ message: "Logged Out" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const logoutAll = async (req, res) => {
    try {
        const tkn = req.header("AuthenticateUser").split(" ")[1];
        if (!tkn) {
            res.status(400).json({ message: "Auth failed" });
        } else {
            const tokens = req.user.tokens;
            //removing all tokens from db
            await User.findByIdAndUpdate(userData._id, { tokens: [] });
            res.status(200).json({ message: "Successfully logged out" });
        }
    } catch (error) {
        res.status(400).json({ error: "Error" });
    }
};

const forgotPass = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email }); //checking if email present in db
        if (!user) return res.status(400).json({ message: "No user found" });
        const otp = Math.floor(Math.random() * 10000);
        await User.findByIdAndUpdate(user._id, {
            otp: otp,
            otpExpire: new Date().getTime() + 300 * 1000, //setting expire time for 5 mins
        });
        await sendEmail({
            emailId: email,
            subject: "OTP for your account at FantasyLeague App",
            message: `OTP to reset password is ${otp},  Otp valid for 5 mins`,
        });
        res.status(200).json({ message: "OTP sent on registered email" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { otp, email } = req.body;
        let currentTime = new Date().getTime();
        const user = await User.findOne({ email: email });
        let diff = user.otpExpire - currentTime;
        if (diff < 0)
            // checking if otp is expired or not
            return res.status(400).json({ message: "Time limit exceeded" });
        if (!otp) res.status(400).json({ error: "Please enter otp!!!" });
        else if (otp == user.otp) {
            return res.status(200).json({ message: "otp verified" });
        } else {
            return res.status(400).json({ message: "invalid otp" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const newPass = async (req, res) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({ email: email });
        if (!password)
            return res.status(400).json({ message: "Please enter details" });
        user.password = password; //updating password
        await user.save();
        res.status(200).json({ message: "password updated" });
    } catch (err) {
        console.log(err);
    }
};

const searchedUsers = async (req, res) => {
    try {
        const { search } = req.body;
        const keyword = search
            ? {
                  $or: [
                      { username: { $regex: search } },
                      { email: { $regex: search } },
                  ],
              }
            : {};
        const users = await User.find(keyword).find({
            _id: { $ne: userData._id },
        });
        res.status(200).json({ users });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        res.status(200).send({ message: "user data deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message, task_status: "failed" });
    }
};

const bookAppointment=async(req,res)=>{
    try {
        const user = userData;
        const {email}=user.email;
        let portfolio=await Portfolio.find({_id:user._id});
        await sendEmail({
        emailId: email,
        subject: "Booking appointment Details",
        message: `Your Booking is successful
                  The details are :${req.body} 
                  Portfolio: ${portfolio}`
    });
    res.status(200).json({message:'Email sent successfully'});
    } catch (error) {
        res.status(500).json({ message: error.message, task_status: "failed" });
    }
}
module.exports = {
    deleteUser,
    newUser,
    userLogin,
    logout,
    logoutAll,
    forgotPass,
    verifyOtp,
    newPass,
    searchedUsers,
    bookAppointment
};
