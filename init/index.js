const mongoose= require("mongoose");
const initData=require("./data.js");// we require all the sampe data
const Listing=require("../models/listing.js");

main()
 .then(()=>{
    console.log("connected to database wanderlust");
 })
 .catch((err)=>{
    console.log(err);
 });

async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

const initDB = async()=>{
    await Listing.deleteMany({});//first we delete all the data that is there in the collection 
    //and now save this initdata-> data
    
    //reinitialize the data
    initData.data=initData.data.map((obj)=>({
      ...obj, owner:"67e5a78d8109637970100166"
    }))
    
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
//we call the initDB function