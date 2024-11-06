const User=require('../models/register')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config()


exports.registerUser=async(req,res)=>{
    try {
        const {username,password,role} = req.body
        const existingUser=await User.findOne({username})
        if(existingUser){
            res.status(400).json({
                success:false,
                message:"User already exist"
            })
        }
        let hashedPassword;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if(password.length >5 && password.length <20 && regex.test(password)){
            hashedPassword=password
        }
        else{
            return res.status(401).json({
                status:false,
                message:'Your password should be in between 5 and 20 characters and contain atleast a capital, small, numerical and special character'
            })
        }   
            
        //securing the password
        try {
            hashedPassword=await bcrypt.hash(password,10) 
        } catch (error) {
            res.status(500).json({
                success:false,
                message:'Error in hashing password'
            })
        } 
        const user=await User.create({
            username,password:hashedPassword,role
        })
        console.log(user)
        return res.status(200).json({
            success:true,
            message:'User created successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'User cannot be registered try again later'
        })
    }
}

exports.loginUser=async(req,res)=>{
    try {
        const{username,password}=req.body
    if(!username || !password ){
        return res.status(400).json({
            success:false,
            message:'Fill all the fields'
        })
    }

    const user=await User.findOne({username})
    if(!user){
        return res.status(401).json({
            success:false,
            message:'Not a valid user'
        })
    }
    const payload={
        username:user.username,
        id:user._id,
        role:user.role
    }
    if(await bcrypt.compare(password,user.password)){
        let token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:'2h'
        })
        user.token=token
        user.password=undefined
        const options={
            expires:new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly:true
        }
        res.status(200).json({
            status:true,
            token,
            user,
            message:'User logged in successfully'
        })
    }
    else{
        return res.status(403).json({
            success:false,
            message:'Password did not match'
        })
    }
} 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            status:false,
            message:'Login failure'
        })
    }
}

exports.getAllUsers=async(req,res)=>{
    try {
        const user=await User.find({})
        res.status(200).json({
            success:true,
            data:user,
            message:"All users fetched successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            data:"Cannot fetched the data",
            message:error.message
        })
    }
}

exports.updateUser=async(req,res)=>{
    try {
        const {id}=req.params
        const {username,role}=req.body
    
        const user=await User.findById({_id:id})

         
            user.username=username
            //user.password=hashedPassword
            user.role=role
            await user.save()
    
            res.status(200).json({
                success:true,
                message:"User updated successfully"
            })
            //console.log(user)
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"User cannot be updated"
        })
    }

}


exports.deleteUser=async(req,res)=>{
    try {
        const{id}=req.params
        const user=await User.findByIdAndDelete({_id:id})
        console.log(user)
        res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            data:"Cannot delete the user",
            message:error.message
        })
    }
}

exports.getUserById=async(req,res)=>{
    try {
        const { id }=req.params
        console.log(id)
        const getUser=await User.findById({_id:id})
        console.log(getUser)
        getUser.password=undefined

        if(!getUser){
            return res.status(400).json({
                success:false,
                message:'User does not exist'
            })
        }
        return res.status(200).json({
            success:true,
            data:getUser,
            message:'User fetched successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


