const mongoose = require("mongoose")
require("dotenv").config()
const connectDB= async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
            .then(()=>{
                console.log("Mongodb connected successfully")
            })
    }
    catch(err){
        console.log("Error while connecting with DB", err)
    }
}
module.exports=connectDB