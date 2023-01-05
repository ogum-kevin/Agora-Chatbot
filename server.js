require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const schools = require('./models-chatbot/schools')
const examination = require('./models-chatbot/examinations')
const conn = require('./db');
const School = require('./models-chatbot/schools')
const WebHookRoute =require('./routes-chatbot/webhook')
const SchoolRoute = require('./routes-chatbot/school')
const ExamRoute = require('./routes-chatbot/examinations')
const DepartmentRoute = require('./routes-chatbot/department')
const CourseRoute = require('./routes-chatbot/courses');
const Department = require('./models-chatbot/department');
const methodOverride= require('method-override');







const app = express();
;
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))

app.set('view engine', 'ejs')



// Routes middleware
app.use("/", SchoolRoute)
app.use("/", CourseRoute)
app.use("/", ExamRoute)
app.use("/", DepartmentRoute)
app.use("/",WebHookRoute)



const stages = ['Y1S1', 'Y1S2', 'Y2S1', 'Y2S2', 'Y3S1', 'Y3S2', 'Y4S1', 'Y4S2', 'Y5S1', 'Y5S2']
app.get('/', async (req, res) => {
    const schoolList = await schools.find()
    if (!schoolList) return res.status(404).json({
        message: "No lists found"
    })
    res.render('main', {
        school_Data: schoolList,
        stage_Data: stages
    })
})

app.get('/get_data', async (req, res) => {
    let typeFilter = req.query.type;
    let parentFilter = req.query.parent_value;
    let responsList = [];
    if (typeFilter = 'load_department') {
        const deptList = await examination.find({
            schoolName: parentFilter
        })
        deptList.map(departments => {
            responsList.push(departments.deptName);
        })
    }
    if (typeFilter = 'load_course') {
        const deptList = await examination.find({
            schoolName: parentFilter
        })
        deptList.map(departments => {
            if (departments != null) {
               return responsList.push(departments.deptName)
            }
        })
    }
    return res.json(responsList);
})
app.get('/get_data/dept', async (req, res) => {

    let parentFilter = req.query.parent_value;
    let typeFilter = req.query.type;
    let responsList = [];

    if (typeFilter == 'load_depts_update'){
         const deptList = await Department.find({
             schoolName: `${parentFilter} `
         })

         deptList.map(departments => {
             responsList.push(departments);
         })
    }
    if (typeFilter == 'load_depts_del') {
         const deptList = await Department.find({
             schoolName: `${parentFilter} `
         })

         deptList.map(departments => {
             responsList.push(departments);
         })
    }

    
    
    return res.json(responsList);
})

app.get('/aboutus', async (req, res) => {
    res.render('aboutus')
})
app.get('/contactus', async (req, res) => {
    res.render('contactus')
})
let SchoolEmptyList=[{
    id:'123',
    schoolName:'No Schools found',
    schoolAbbr:""
}]
app.get('/schools', async (req, res) => {
    const schoolList = await schools.find()
    if (!schoolList || schoolList.length === 0) return res.render('schools', {
        school_Data: SchoolEmptyList
    })
        
    
    res.render('schools', {
        school_Data: schoolList,
    })
})
app.get('/dept', async (req, res) => {
    const schoolList = await schools.find()
    if (!schoolList) return res.status(404).json({
        message: "No lists found"
    })
    res.render('dept', {
        school_Data: schoolList
    })
})







app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port successfully`);
})