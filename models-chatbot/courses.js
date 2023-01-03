//const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const Examinations = require('./examinations');

//mongoose.Schema.Types.String.set('validate', v => v == null || v > 0);
const courseSchema = mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        maxLength: 80,
        minLength: 1
    },
    courseAbbr: {
        type: String,
        required: true,
        maxlength: 4,
        minLength: 1
    },
    courseCode: {
        type: Number,
        required: true,
        maxlength: 4,
        minLength: 1
    },
    courseStage:{
        type:String,
        required:true,
        maxLength:4,
        minLength:1,
        enum:{
            values: ['Y1S1', 'Y1S2', 'Y2S1', 'Y2S2', 'Y3S1', 'Y3S2', 'Y4S1', 'Y4S2', 'Y5S1', 'Y5S2'],
            message:`{VALUE} is not supported`
        }
    },
    courseExams: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Examinations'
        }

    ]
})

module.exports = mongoose.model('Courses', courseSchema)