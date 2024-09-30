const mongoose=require('mongoose')
require('dotenv').config()


const connectDb=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log("Connection established successfully")})
    .catch((err)=>{
        console.log("Connection failed",err)
        //process.exit(1)
    })
}

module.exports=connectDb