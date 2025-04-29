if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}



const express= require("express");
const app = express();
const ejs= require("ejs");
const mongoose= require("mongoose");
const Listing=require("./models/listing.js"); //we have required the model listing from the listing file in models folder
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");//fo error better handling, wecan remove try and error block and this wrapAsync funtion to all async function
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js"); //we required 1st listing schema and then we created review scmea so we required it together as they are created in same address
const Review=require("./models/review.js");
const Session =require("express-session");//requiring it for the cookies
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");  //for the flash message , here it will appear after new listing is added
const passport= require("passport"); // setting it up for the authentication
const LocalStrategy = require("passport-local");
const User=require("./models/user.js");

//for express routing
const listingRouter =require("./routes/listing.js");
const reviewRouter =require("./routes/review.js");
const userRouter =require("./routes/user.js");

//we can use anyone of these the given url to connect our data base server 1.local 2.cloud

//this is local machine urls 
// const mongoDbUrl="mongodb://127.0.0.1:27017/wanderlust"

//MongoAtlas Url
const dbUrl= process.env.ATLASDB_URL

//forming a connection
//calling a function main
main()
 .then(()=>{
    console.log("connected to database wanderlust");
 })
 .catch((err)=>{
    console.log(err);
 });

async function main(){
   await mongoose.connect(dbUrl);  //"mongodb://127.0.0.1:27017/wanderlust" this url was for local host now we have replaced it with the mongo atlas cloud
};

// Set up EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));//is used to parse URL-encoded data from incoming requests //when we will click on the listing title that we set as the link in check in index.ejs
app.use (methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));//we are using our static files in the public folder


//we create a similar function for review schema as for the listing

//here was the middleware for the validateReview

//we are going to store the sessions now in the mongobd atlas i.e in cloud
// before this it was ssacving the local memory 

const store = MongoStore.create({
    mongoUrl:dbUrl, //we can write local url address also
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR!, in the mongo session store",err);
});

//session option for the cookies
const sessionOptions={
    store, //this we pass for session error
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000, //give the expire date to the cookies feom date of login + no. ofm days we want
        maxAge:7*24*60*60*1000, //these are days,hrs a day,min per hr , sec/min , msec/sec
        httpOnly:true, //for security purpose
    },
};

//sending request to the home 
// app.get("/",(req,res)=>{
//     res.send("This is the home page");
// });


//using session middleware
app.use(Session(sessionOptions));
//flash
app.use(flash()); // after this we will use flassh in diffrenet routes

//Configuration of passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//success and error flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success"); //we use this local and success key in middleware 
    res.locals.error=req.flash("error"); 

    //it is not flash but using local for storing the info
    res.locals.currUser=req.user; //we are saving the info of user in currUser aslocal to use it in the ejs
    next();
});

// //DEMO USER
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"pals@gmsil.com",
//         username:"demo_user"
//     });
//     let registeredUser=await User.register(fakeUser , "helloPassword");
//     res.send(registeredUser);
// });


//IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT
// we have replaced all our listings and reviews with this a single line and it will use all the listings in routes folder 
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);

// we have replaced all our user with this a single line and all the code is in the user.js or routes folder 
app.use("/",userRouter);


//this route if for all the invalid api calls
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));//it will give diffrent error status that other errs as this is new error we created
});

//WE ARE MAKING A CUSTOM ERROR MIDDLEWARE
app.use((err,req,res,next)=>{ 
    let{statusCode=500,message="something went wrong"}=err;
   res.status(statusCode).render("error.ejs",{message}); //we are using res.send because here the cycle will end
});


// //testing modellisting
// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"MY NEW VILLA",
//         description:"By the Beach",
//         price:2200,
//         location:"Malad West",
//         country:"India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });

//listening to the server 
app.listen(8080,()=>{
    console.log("Server is listening to the port:8080 ");
});
