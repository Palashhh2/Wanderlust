const { date } = require("joi");
const mongoose=require ("mongoose");
const Schema = mongoose.Schema;

//defining the schema
const reviewSchema= new Schema({
    comment: String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    date:{
        type:Date,
        default:Date.now()
    },

    author:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    
});
//creating a model, here the model name and the database name both are same
const Review=mongoose.model("Review",reviewSchema);

module.exports= Review;

//now what we want is each listing will have a review field in it so we go listing.js and add a review field