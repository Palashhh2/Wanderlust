const User =require("../models/user.js");

module.exports.renderSignUp=async(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signUp=async(req,res)=>{
    try{
        let{username,email,password}=req.body; // extracting all of this from the body of form
        const newUser=new User({email,username});   //using it to create a new user
        const registeredUser= await User.register(newUser,password);//value of new user and passsword will be accessed here
        console.log(registeredUser); //registered a user
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to the Wanderlust");
            res.redirect("/listings"); 
        })
     }catch(e){
        req.flash("error",e.message); //the error are flashed on the same page rather going on some other random page 
        res.redirect("/signup");
    };

};

module.exports.renderloginform=async(req,res)=>{
    res.render("users/login.ejs");
};


module.exports.postlogin=async(req,res)=>{                    //if failure comes it will redirect to login to enter the crendential again 
    req.flash("success","Welcome back to Wanderlust"); //in this if it passes middle ware then this will run
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{ // it is method that deletes the current session 
        if(err){
            return next(err);
        }
        req.flash("success","You are now logged out!");
        res.redirect("/listings");
    });
    
};
