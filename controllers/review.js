const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.postReview=async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);//we are saving the obejct comment and rating
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review Posted!");//for flashing message
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async(req,res)=>{
    let{id,reviewId}=req.params; //we need to extract data of both review and the listing also
    
    //we willuse pull operrator to remove the object id from the listing that was saved in the listing 
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}}); //so once the review is delted the object id that was saved in the listing will also be removed out of the array ob obejcts
    await Review.findByIdAndDelete(reviewId); 

    req.flash("success","Review Deleted!");//for flashing messsage
    res.redirect(`/listings/${id}`);
};

