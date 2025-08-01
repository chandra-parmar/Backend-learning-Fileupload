const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
require('dotenv').config()

const fileSchema = new mongoose.Schema(
    {
       name:{
        type:String,
        required:true
       },
       imageUrl:{
        type:String
       },
       tags:{
        type:String
       },
       email:{
        type:String
       }
    }
)

//post middleware
fileSchema.post('save',async function (doc)
{
    try{
        console.log('DOC',doc)

        //transporter for email sending
        const transporter = nodemailer.createTransport(
    {
         
        host:process.env.MAIL_HOST,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
  },
}
); 

  //send mail
  let info = await transporter.sendMail({
    from: `chinu`,
    to: doc.email,
    subject: "new file uploaded on cloudinary",

    html: "<h1>hello je </h1> <p>File uploaded</p>", // HTML body
  });

  console.log(info)
  


    }catch(error)
    {
     console.error(error)
    }
})


const File = mongoose.model('File',fileSchema)
module.exports = File