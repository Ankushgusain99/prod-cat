const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["admin","user"]
    },
})

module.exports=mongoose.model("user",userSchema)




