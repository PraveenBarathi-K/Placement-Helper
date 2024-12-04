// Alumni.js
const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: String,
  availability: {
    sunday: {
      type: Boolean,
      default: false
    },
    monday: {
      type: Boolean,
      default: false
    },
    tuesday: {
      type: Boolean,
      default: false
    },
    wednesday: {
      type: Boolean,
      default: false
    },
    thursday: {
      type: Boolean,
      default: false
    },
    friday: {
      type: Boolean,
      default: false
    },
    saturday: {
      type: Boolean,
      default: false
    }
  }

});

alumniSchema.methods.isAvailable = function(date) {
    
    const dayOfWeek = date.getDay();
  

    switch (dayOfWeek) {
      case 0: // Sunday
        return this.availability.sunday === true;
      case 1: // Monday
        return this.availability.monday === true;
      case 2: // Tuesday
        return this.availability.tuesday === true;
      case 3: // Wednesday
        return this.availability.wednesday === true;
      case 4: // Thursday
        return this.availability.thursday === true;
      case 5: // Friday
        return this.availability.friday === true;
      case 6: // Saturday
        return this.availability.saturday === true;
      default:
        return false; 
    }
  };
  

module.exports = mongoose.model('Alumni', alumniSchema);
