//We are going to define our user schema and model here
const mongoose=require ("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");//we are using for the authentication 

//we need field like email, username, password // But passport-local-mongoose automatically adds username and hash, salts
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose); //plugin adds username , hash , salt field automatically so we dont need to enter it in the schmea, it also addd few methods for the authentication 

module.exports = mongoose.model("User",userSchema);