// Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  allocated: { type: Boolean, default: false },
  // Add more fields as needed
});

module.exports = mongoose.model('Student', studentSchema);
