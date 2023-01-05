const express = require('express');
const { find } = require('lodash');
const mongoose =require('mongoose')

const School = require('../models-chatbot/schools');
const router = express.Router();


const schoolPath ='v1/school';
const errormessage = {
    message: "The new school has not been saved"
}

const successMessage = {
    message: "The new school has been saved successfully"
};


//Add new school to the schools------POST

router.post(`/${schoolPath}/add`, async(req,res) =>{
    const findSchool =  await School.findOne({schoolName :req.body.schoolName.toUpperCase()})
    if(findSchool){
       return res.status(200).json({message:'school already exists'})
    }
    const newSchool =  new School({
        schoolName : req.body.schoolName.toUpperCase(),
        schoolAbbr : req.body.schoolAbbr.toUpperCase(),
    })

    const savedSchool = await newSchool.save();

    if(!savedSchool){
       return res.status(500).json(errormessage)
    }

   return res.redirect('/schools');
})


//Find the list of schools ----GET

router.get(`/${schoolPath}/find`,async(req,res) =>{

    try {
        const schoolList =  await School.find()
        if(!schoolList){
            res.status(403).json(errormessage)
        }

        res.status(200).send(schoolList);
    } 
    
    catch (error) {
        res.status(500).json({err:error})
    }
})

const findOneMessage_Not_Found ={
    message:"The school could not be found"
}

const findOneMessage_Error={
    message:"There was error in application"
}

const findOneMessage_Success={
    message:"The school was found"
}

router.get(`/${schoolPath}/findOne`,async (req,res) =>{
    try {
        const schoolName = await School.findOne({schoolAbbr : req.body.schoolAbbr.toUpperCase()});
        if(!schoolName || null || undefined){
            return res.status(200).json(findOneMessage_Not_Found)
        }
        
        return res.status(200).json(schoolName);
    } 
    catch (error) {
        return res.status(500).json(error.message)
    }
})


//Edit the list of schools ----Patch

//the patch rest application

router.get(`/${schoolPath}/updateOne`,async(req,res)=>{
    try {
        console.log('The update has been activated now')
    } 
    catch (error) {
         return res.status(500).json(error.message)
    }
})

router.delete(`/${schoolPath}/delete`,async(req,res) =>{
    
    try {
        let schoolId = req.body.deleteSchool;
         if (!mongoose.Types.ObjectId.isValid(schoolId.trim())){
             return res.status(404).json({
                 msg: `No task with id :${schoolId.trim()}`
             })}
        if(schoolId ===null || schoolId === undefined){
            return res.status(403).json({message:"THE ID CANNOT BE NULL!"})
        }
        

          const deleteSchool = await School.findByIdAndDelete(schoolId.trim())
          if (!deleteSchool) {
            return res.status(403).json({message:"Error in deleting"})
          }
            //const schoolList = await School.find();
          return res.redirect('/schools')

         
        
    } 
    catch (error) {
        return res.status(500).json(error.message);
    }
})

module.exports= router;