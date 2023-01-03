const Router = require('express').Router();

const Department = require('../models-chatbot/department');
const School =require('../models-chatbot/schools')
const deptPath = 'v1/departments';
const mongoose =require('mongoose')

const errormessage = {
    message: "The new department has not been saved"
}

const successMessage = {
    message: "The new department has been saved successfully"
};

Router.post(`/${deptPath}/add`, async (req, res) => {
    const findDept = await Department.findOne({
        deptName: req.body.deptName.toUpperCase()
    })
    if (findDept) {
        return res.status(200).json({
            message: 'Department already exists'
        })
    }
    const newDepartment = new Department({
        schoolName: req.body.schoolName.toUpperCase(),
        deptName: req.body.deptName.toUpperCase(),
        deptAbbr: req.body.deptAbbr.toUpperCase(),
    })

    const savedDepartment = await newDepartment.save();

    if (!savedDepartment) {
        return res.status(500).json(errormessage)
    }

    return res.render('aboutus')

})

Router.get(`/${deptPath}/find`, async (req, res) => {

    try {
        const departmentList = await Department.find()
        if (!departmentList) {
            res.status(403).json(errormessage)
        }

        return res.status(200).send(departmentList);
    } catch (error) {
        return res.status(500).json({
            err: error
        })
    }
})

const findOneMessage_Not_Found = {
    message: "The department could not be found"
}

const findOneMessage_Error = {
    message: "There was error in application"
}

const findOneMessage_Success = {
    message: "The department was found"
}

Router.get(`/${deptPath}/findOne`, async (req, res) => {
    try {
        const departmentName = await Department.findOne({
            departmentAbbr: req.body.departmentAbbr.toUpperCase()
        });
        if (!departmentName || null || undefined) {
            return res.status(200).json(findOneMessage_Not_Found)
        }

        return res.status(200).json(departmentName);
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

Router.patch(`/${deptPath}/updateOne`, async (req, res) => {
    try {

        const filter={
            _id:req.body.deptName
        }
        const update={
            deptName:req.body.newDeptName.toUpperCase()
        }

        const updatedDoc= await Department.findOneAndUpdate(filter,update,{new:true});
        if(!updatedDoc){
            return res.status(403).json({message:"The document has not been updated"})
        }

        return res.redirect('/dept')
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

Router.delete(`/${deptPath}/delete`,async(req,res) =>{
    try {
        let deptId = req.body.deleteIdName;
        if (!mongoose.Types.ObjectId.isValid(deptId.trim())) {
            return res.status(404).json({
                msg: `No task with id :${deptId.trim()}`
            })
        }
        if (deptId === null || deptId === undefined) {
            return res.status(403).json({
                message: "THE ID CANNOT BE NULL!"
            })
        }


        const deleteDept = await Department.findByIdAndDelete(deptId.trim())
        if (!deleteDept) {
            return res.status(403).json({
                message: "Error in deleting"
            })
        }
        const schoolList = await School.find();
        return res.redirect('/dept')
    } catch (error) {
        return res.status(500).json(error.message);
    }
})


module.exports = Router;