const express = require("express");
const router = express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");//fo error better handling, wecan remove try and error block and this wrapAsync funtion to all async function
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js"); //we will now use this fuction as middlewarein the routes 
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

const listingController=require("../controllers/listing.js");

// we are doing express routing 

//INDEX ROUTE -make index.ejs file in the listings views/folder
router.get("/",listingController.index);

//NEW ROUTE- make file new.ejs and also create a button in the form to trigger the action
router.get("/new",isLoggedIn,listingController.renderNewForm) ;

//CREATE ROUTE -
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createNewForm));

//SHOW ROUTE - it will show all the data of the single listing-make show.ejs file in the views/listings folder  
router.get("/:id", wrapAsync(listingController.showListings));

//EDIT route- we will render the edit  form from edit.ejs
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.edtListing));

//UPDATE ROUTE
router.put("/:id", 
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.updateListing));

//DELETE ROUTE
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing));

//NOW EXPORTING THIS AND USING IN app.js

module.exports= router;