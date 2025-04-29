//heree we can tn transfer all the reviews related code like its validation , routes and otherr details 
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");//fo error better handling, wecan remove try and error block and this wrapAsync funtion to all async function
const ExpressError=require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");


const reviewController=require("../controllers/review.js")

//Reviews Post Route
router.post("/",isLoggedIn,validateReview,
    wrapAsync(reviewController.postReview));

//to make it appear these reviews we will go to show.ejs and and then appear it using populate function in app.get show listing route

//REVIEW DELETE ROUTE
//DELETE ROUTE
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports= router;