const Listing=require("../models/listing.js");

//we write all our async functions here and use them as the middle ware,it makes our code more compact and easy to read

module.exports.index =async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
};


module.exports.renderNewForm=async(req,res)=>{ //we have used a middleware as function that authenticates the user 
    res.render("listings/new.ejs");
};

module.exports.createNewForm=async(req,res)=>{ //we added a wrapAsync function and passed whole code as an argument

    let url=req.file.path;
    let filename=req.file.filename;

    const newListing = new Listing(req.body.listing);// we are accessing the body data of the listing object that we created in the new.ejs
    newListing.owner=req.user._id; //using it in phase 2 to view owner of new listing created
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing added!");//now becuse it is redirecting to the index route we will go to index.ejs to use it
    res.redirect("/listings");
};

module.exports.showListings=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner"); //we used populate here for the reviews/owner to make it visible , full object will be print in show.ejs and not just objectid
    if(!listing){ 
        req.flash("error","Listing requested does not exists!"); // so instead of throwing error we can simply send a flash and redirect it to page if there is now listing is present of the id we are trying to access
        res.redirect("/listings");
    };
    res.render("listings/show.ejs",{listing});

};

module.exports.edtListing=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id); //we removed{} as ({id}) beacause id is treated as a string
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");//we are changing the pixels of img as preview imgae dont need to be good quality  //we are replacing the og img url //we can see that image url saved in cloudinary has upload in its links that ais we are replacing
    res.render("listings/edit.ejs",{listing ,originalImageUrl}); //we aill also access the replaced originalimageurl
};

module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}); //we are deconstructing the body
    
    if (typeof req.file!=="undefined"){
        let url = req.file.path;
        listing.image={url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated!");//for flash message
    res.redirect(`/listings/${id}`);//it will be redirect to show route again ,it will give better understanding if the chages were made or not
};

module.exports.deleteListing=async(req,res)=>{
    let{id}=req.params;
    let deleteListing =await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");//flasshing message
    res.redirect("/listings");
};

