const mongoose=require ("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");//we required it , for post middleware that we create in phase 2 for handling listing deltion along with reviews

//defining the schema
const listingSchema= Schema({
    title:{
        type:String,
        required:true
    },
    description:String,

    image:{
        url: String,
        filename:String,
    },
                  // this was used when we have to use file_url or link 
                  // type:String,
                  // set:(v)=> v === ""?"https://images.unsplash.com/photo-1640012324438-c935f971b311?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  // :v,
                  //we have set the image , default image you can read about ternary operator

    price:Number,
    location:String,
    country:String,
    //we are this field as part of phase 2 project review so that every listing will have seperate review
    //and the relation will be one to many as there can be multiple reviews for one listing
    reviews:[{
        type: mongoose.Schema.Types.ObjectId, //read about thid cam remember
        ref:"Review" //it is the reference model where it is taking its object id from //that is we are storing childs ref in parent because of 1*n relation
    },
   ],
   owner:{ //adding the owner property in the schema
    type:Schema.Types.ObjectId,
    ref:"User", //taking refrence as user as we are going to use the objectid of users
   },
});

//we are now creating a post middle ware for listing delte handling
listingSchema.post("findOneAndDelete",async(listing)=>{ //findOneAndDelete is similar to findByIdAndDelete , A triggers B and B trigger to work we gave
    if (listing){
        await Review.deleteMany({_id:
            {$in: listing.reviews}});//we used in operator to delete the reviews in listing.reviews
    }
});


//creating a model, here the model name and the database name both are same
const Listing=mongoose.model("Listing", listingSchema);

//we can now export our model to use it
module.exports=Listing;