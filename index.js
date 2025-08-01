const express= require('express')
const app = express()
const PORT = 7000


//middleware
app.use(express.json())

const fileUpload= require('express-fileupload')
app.use(fileUpload(
    {
        useTempFiles:true,
        tempFileDir:'/tmp/'
    }
))


//default route
app.get('/',(req,res)=>{
    res.send("hello world")
})


//api mount
const Upload = require('./routes/FileUpload')
app.use('/api/v1/upload',Upload)


//database connect
const  dbConnect = require('./config/database')
dbConnect()


//cloud connect
const cloudinary = require('./config/cloudinary')
cloudinary.cloudinaryConnect()


//server listen 
app.listen(PORT,()=>{
    console.log("Server is listing to port "+PORT)

})


