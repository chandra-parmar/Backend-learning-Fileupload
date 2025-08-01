const express = require('express')
const router = express.Router()


const { fileUpload ,imageUpload,videoUpload} = require('../controllers/fileUpload');



//api route
router.post('/localFileUpload',fileUpload)
 router.post('/imageUpload',imageUpload)
router.post('/videoUpload',videoUpload)


module.exports = router
