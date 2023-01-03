const Router = require('express').Router();
const Course = require('../models-chatbot/courses')


const coursePath = 'v1/courses';

const errormessage = {
    message: "The new course has not been saved"
}

const successMessage = {
    message: "The new course has been saved successfully"
};

Router.post(`/${coursePath}/add`, async (req, res) => {
    const findCourse = await Course.findOne({
        courseName: req.body.courseName.toUpperCase()
    })
    if (findCourse) {
        return res.status(200).json({
            message: 'Course already exists'
        })
    }
    const newCourse = new Course({
        courseName: req.body.courseName.toUpperCase(),
        courseAbbr: req.body.courseAbbr.toUpperCase(),
        courseCode: req.body.courseCode,
        courseStage: req.body.courseStage.toUpperCase()
    })

    const savedCourse = await newCourse.save();

    if (!savedCourse) {
        return res.status(500).json(errormessage)
    }

        return res.status(200).json(successMessage)
})

Router.get(`/${coursePath}/find`, async (req, res) => {

    try {
        const courseList = await Course.find()
        if (!courseList) {
            res.status(403).json(errormessage)
        }

        return res.status(200).send(courseList);
    } catch (error) {
        return res.status(500).json({
            err: error
        })
    }
})

const findOneMessage_Not_Found = {
    message: "The course could not be found"
}

const findOneMessage_Error = {
    message: "There was error in application"
}

const findOneMessage_Success = {
    message: "The course was found"
}

Router.get(`/${coursePath}/findOne`, async (req, res) => {
    try {
        const courseName = await Course.findOne({
            courseAbbr: req.body.courseAbbr.toUpperCase()
        });
        if (!courseName || null || undefined) {
            return res.status(200).json(findOneMessage_Not_Found)
        }

        return res.status(200).json(courseName);
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

Router.get(`/${coursePath}/updateOne`, async (req, res) => {
    try {
        console.log('The update has been activated now')
    } catch (error) {
        return res.status(500).json(error.message)
    }
})



module.exports = Router;