const Router = require('express').Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const _ = require('lodash')

const ExamsModel = require('../models-chatbot/examinations');
const {uploadFile} = require('./bucket')

//starndard path for the exam path
const ExamPath = 'v1/exams';



//file upload s
const FILEUPLOAD = {
    "application/pdf": "pdf",
    "application/x-pdf": "x-pdf",
    "image/png": "png",
    "image/jpeg": "jpeg"
}

//Multer pdf file storage preparations
const storageOption = multer.memoryStorage()
/*const storageOption = multer.diskStorage({

    destination: (req, file, cb) => {
        let isValid = FILEUPLOAD[file.mimetype];
        let uploadError = new Error(`The file type ${file.mimetype} is not a valid file type`);
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/documents')
    },
    filename: (req, file, cb) => {
        const fileGen = crypto.randomBytes(16)
        cb(null, `${fileGen.toString('hex')}${path.extname(file.originalname)}`)
    }
})*/

const uploads = multer({
    storage: storageOption
})

const randomBytes = () => crypto.randomBytes(16).toString('hex');
//Routes handling section

Router.post(`/${ExamPath}/add`, uploads.single('document'), async (req, res) => {

    try {
        const filePath = `${randomBytes()}${path.extname(req.file.originalname)}`;
        const file= req.file;
        console.log(file)
        
        const result=await uploadFile(file,filePath)


        //const basePath = `${req.protocol}://${req.get('host')}/public/documents/`;
        const newExamination = new ExamsModel({
            schoolName: req.body.schoolName.toUpperCase(),
            deptName: req.body.deptName.toUpperCase(),
            courseCode: req.body.courseCode.toUpperCase(),
            courseName: req.body.courseName.toUpperCase(),
            examPaperPath: `${filePath}`,
            examYear: req.body.examYear,
            examStage: req.body.examStage.toUpperCase(),
            examLecturer: _.capitalize(req.body.examLecturer),
            // catPaper
        })

        const savedExams = await newExamination.save();
        if (!savedExams) {
            return res.status(500).json("The exam has not been saved")
        }

        return res.render('aboutus');

    } catch (error) {
        return res.status(403).json(error)
    }

})

/*THIS ARE THE GET ROUTES */

Router.get(`/${ExamPath}/find/:courseCode`, async (req, res) => {
    const findField = _.toUpper(req.params.courseCode);

    try {
        const findExamList = await ExamsModel.find({
            courseCode: findField
        })
        if (!findExamList || findExamList.length === 0) {
            return res.send(`The exam of the course code ${_.toUpper(req.params.courseCode)} cannot be found`)
        }
        //pipe the writestream
        return res.status(200).json(findExamList)
    } catch (error) {
        return res.status(500).json(error.message);
    }
})

Router.get(`/${ExamPath}/findOne/:courseCode/:examYear`, async (req, res) => {
    const filter1 = {
        courseCode: _.toUpper(req.params['courseCode'])
    }
    const filter2 = {
        examYear: _.toUpper(req.params['examYear'])

    }

    try {
        const courseList = await ExamsModel.findOne({
            $and: [filter1,
            filter2]
        })

        if(!courseList || courseList==null){
            return res.send(`The examination ${_.toUpper(req.params['courseCode'] )} of the year ${_.toUpper(req.params['examYear'])} is not available`)
        }
        return res.send(courseList)

    } catch (error) {
        return res.send(error.message);
    }

})

/*This are the update routes for the exams */



module.exports = Router;