
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Connecting Alumni and Student from models directory
const Alumni = require('./models/Alumni');
const Student = require('./models/Student');

const app = express();

//Connecting to mongodb
mongoose.connect('mongodb://localhost:27017/interview_scheduler', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

//setting up the view engine to display the webpage
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//default fuction get called when runnig the "node sever.js"
app.get('/', async (req, res) => {
  try {
    const alumni = await Alumni.find();
    const students = await Student.find();

    //calling the mapping fuction to schedule alumni and students
    const interviewSchedule = generateInterviewSchedule(alumni, students);
    
    //passing the alumni, students and interviewSchedule to the interviewSchedule.ejs file to display 
    res.render('interviewSchedule', { alumni, students, interviewSchedule });
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).send('Internal Server Error');
  }
});

//fuction to map students and alumni
function generateInterviewSchedule(alumni, students) {
  const maxStudentsPerDay = 7; 
  const numDays = Math.ceil(students.length / maxStudentsPerDay);
  const interviewSchedule = [];

  for (let day = 0; day < numDays; day++) {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + day);   //instead of getDate() we can specify the required date
    startTime.setHours(9);                          //setting staritng time to 9:00:00 am
    startTime.setMinutes(0);
    startTime.setSeconds(0);

    
    const availableAlumni = alumni.filter(alumnus => {
      return alumnus.isAvailable(startTime);
    });

    availableAlumni.forEach(alumnus => {
      startTime.setDate(startTime.getDate());
      startTime.setHours(9);
      startTime.setMinutes(0);
      startTime.setSeconds(0);


      const unallocatedStudents = students.filter(student => !student.allocated);
      const studentsForAlumni = unallocatedStudents.splice(0, maxStudentsPerDay);

      studentsForAlumni.forEach(student => {
        student.allocated = true;
        interviewSchedule.push({
          alumniId: alumnus._id,
          studentName: student.name,
          date: startTime.toDateString(),
          time: startTime.toLocaleTimeString()
        });
        startTime.setHours(startTime.getHours() + 1);
      });
    });
  }

  return interviewSchedule;
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
