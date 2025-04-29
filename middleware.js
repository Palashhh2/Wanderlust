const Listing=require("./models/listing"); //requiring because we need listing model used in the middleware to extract params
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema} = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

//it only has middle ware for the authentication of login user and then using it in the routes
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;//using it for solving the flaw of login to original url
        req.flash("error","You must be login for this!");
        return res.redirect("/login");
    }
    next();
};

//we are saving our redirecturl in local to access it everywhere and passport has no control over it
module.exports.saveRedirectUrl=(req,res,next)=>{ //now we will call this middle ware in login before authentication
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
//go and require it in listing.js 
//pass it as a middleware in the routes that will first check the authentication of user and then lets you create,edit,delete etc

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner");
        return res.redirect(`/listings/${id}`);
}
next();
};

//middle ware for validation on server side
module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

//middle ware for validation of reviews on server side,now just pass validateReview in review post request
module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of the review");
        return res.redirect(`/listings/${id}`);
}
next();
}