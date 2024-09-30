const express=require('express')

const app=express()
const cors=require('cors')
require('dotenv').config()
const port=process.env.PORT || 4000
app.use(cors());
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json())
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
const dbConnect=require('./src/database/connectDb')

dbConnect()


const cloudinary=require('./src/database/cloudinary')
cloudinary.cloudinaryConnect()

app.listen(port,()=>{
    console.log(`This application is running at port ${port} `)
})

const route=require('./src/routes/allRoutes')
app.use('/api/v1',route)


