
const File = require('../models/File')
const cloudinary = require('cloudinary').v2

const fs = require('fs');
const path = require('path');

const fileUpload = async (req, res) => {
  try {
    const file = req.files.file;
    console.log(file);

    // Define path
    const fileExtension = path.extname(file.name); // safer than split
    const filePath = path.join(__dirname, 'files', `${Date.now()}${fileExtension}`);
    console.log("Path:", filePath);

    // Ensure 'files' directory exists
    const uploadDir = path.join(__dirname, 'files');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // ✅ Wait for file to move
    await new Promise((resolve, reject) => {
      file.mv(filePath, (err) => {
        if (err) {
          console.log("File upload error:", err);
          return reject(err);
        }
        resolve();
      });
    });

    // Send success response
    res.json({
      success: true,
      message: "Local file uploaded successfully",
    });

  } catch (error) {
    console.error("Caught error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during upload",
    });
  }
};

function isFileTypeSupported(type,supportedTypes)
{
  return supportedTypes.includes(type)
}

//cloudinary upload function
async function uploadFileToCloudinary(file,folder,quality)
{
  const options = {folder}
  console.log('temp file path', file.tempFilePath)

  //if quality given then include in option
  if(quality)
  {
    options.quality =quality
  }

  options.resource_type ="auto"
 return  await cloudinary.uploader.upload(file.tempFilePath,options)
}

//image uploader handler
  const imageUpload = async(req,res)=>{
  try{

    //fetch data
    const {name,tags,email } = req.body
    console.log(name,tags,email)
   
    //file fetch
    const file = req.files.imageFile
    console.log(file)

    //validation check file type
    const supportedTypes = ['jpg','jpeg','png']
    const fileType = file.name.split('.')[1].toLowerCase()
    
    if(!isFileTypeSupported(fileType,supportedTypes))
    {
      return res.status(400).json(
        {
          success:false,
          message:"File format not supported"
        }
      )
    }

    //file type supported upload to cloudinary

    const response = await uploadFileToCloudinary(file,"imageupload")
    console.log(response)

    //save entry in database
    const fileData = await File.create(
      {
        name,
        tags,
        email,
        imageUrl:response.secure_url
      }
    )
   res.json(
    {
      success:true,
      imageUrl:response.secure_url,
      message:"Image successfully uploaded"
    }
   )

  }catch(error)
  {
    console.error(error)
    res.status(400).json(
      {
        success:false,
        message:"Something went wrong "
      }
    )

  }
}
  

//video upload handler
const videoUpload = async(req,res)=>{
  try{
    
    //data fetch
    const {name,tags, email } = req.body
    console.log(name,email,tags)

    //video fetch
    const file = req.files.videoFile

    //validation
    const supportedTypes =['mp4',"mov"]
    const fileType= file.name.split('.')[1].toLowerCase()
    console.log('file type',fileType)

    if(!isFileTypeSupported(fileType,supportedTypes))
    {
      return res.status(400).json(
        {
          success:false,
          message:"file format not supported"
        }
      )
    }
   
    //file size above 5 mb validation 
    const MAX_SIZE = 5*1024*1024

    const fileSize = file.size 
    if(fileSize >MAX_SIZE)
    {
      return res.status(400).json(
        {
          success:false,
          message:"File size exceeds 5 mb limit"
        }
      )
    }

    //upload to cloudinary
    const response = await uploadFileToCloudinary(file,"imageupload")
    console.log(response)

    //entry in db 
    const fileData = await File.create(

      {
        name,
        tags,
        email,
        videoUrl:response.secure_url
      }
    )

    //return response
    res.json(
      {
        success:true,
        videoUrl:response.secure_url,
        message:"Video uploaded successfully"
      }
    )


  }catch(error)
  {
   console.error(error)
   res.status(400).json(
    {
      success:false,
      message:"Something went wrong"
    }
   )
  }
}








module.exports = {
  fileUpload,
  imageUpload,
  videoUpload,
  
  
  
};
