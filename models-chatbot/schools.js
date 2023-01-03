//const { type } = require('express/lib/response');
const mongoose= require('mongoose');
const Department = require('./department')

//mongoose.Schema.Types.String.set('validate', v => v == null || v > 0);
const schoolSchema = mongoose.Schema({
    schoolName : {
        type:String,
        required:true,
        maxLength:100,
        minLength:1,
    },
    schoolAbbr : {
        type : String,
        required : true,
        maxLength : 5,
        minLength:3,
        /*
        enum :{
            values:['SOE','SOAS','SOL','SOM'],
            message:{VALUE} is not supported
        }
        */
    }
})

module.exports = mongoose.model('School',schoolSchema);