const mongoose = require('mongoose');

const connectDb= async (req,res)=>{
    try {
        await mongoose.connect(process.env.CONNECTION_STRING)
    console.log("data base connected...")
    } catch (error) {
        console.error('error connecting database',error)
        process.exit(1);
    }
    
}

module.exports=connectDb;