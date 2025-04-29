//here we can tn transfer all the users related code
const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User =require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js'); //requiring this from the middleware.js

const userController=require("../controllers/user.js")

//Get Route
router.get("/signup",userController.renderSignUp);

//Post Route
router.post("/signup",wrapAsync(userController.signUp));

//FOR LOGIN
//get login route- form will have username and passsword
router.get("/login",userController.renderloginform);

//post route- authentication for the user if it exists or not
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{         //local is strategy used for authentication i.e. to check the username and password
    failureFlash:true,                    //automatic flash is generted in case of failure login 
    failureRedirect:"/login"
    }),
    userController.postlogin);                                 //here we are passing a middleware passport authenticate which has 2 fields 

//FOR LOGOUT
router.get("/logout",userController.logout);

//NOW EXPORTING THIS AND USING IN app.js

module.exports= router;