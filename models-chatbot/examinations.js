const mongoose = require('mongoose');
//mongoose.Schema.Types.String.set('validate', v => v == null || v > 0);

const examSchema = mongoose.Schema({
    schoolName: {
        type: String,
        required: true
    },
    deptName: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    examPaperPath: {
        type: String,
        required: true
    },
    examYear: {
        type: String,
        required: true
    },
    examStage: {
        type: String,
        required: true,
    },
    examLecturer: {
        type: String
    },
    catPaper: [{
        type: String
    }],

})

module.exports = mongoose.model('Examinations', examSchema);