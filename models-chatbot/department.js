const mongoose =require('mongoose');
const Courses = require("./courses");
//mongoose.Schema.Types.String.set('validate', v => v == null || v > 0);
const departmentSchema = mongoose.Schema({
    schoolName:{
        type:String,
        required:true
    },
    deptName : {
        type:String,
        required:true,
        maxlength : 100,
    },
    deptAbbr :{
        type:String,
        required:true,
        maxlength:4,
    }
})

module.exports = mongoose.model('Department',departmentSchema);