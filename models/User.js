const mongoose = require("mongoose");


const completedCoursesSchema = new mongoose.Schema({
  course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
  },
  completionDate: {
    type: Date,
  },
  certificate: {
    type: String,
  }
});

const Complaint = new mongoose.Schema({
  message: {
      type: String,
  },
  complaintDate: {
    type: Date,
  },
  isReacted: {
    type: Boolean,
    default: false,
  }
},{
  timestamps: true
});


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  completedCourses: [completedCoursesSchema],
  complaint: [Complaint],
},{
  timestamps: true
});


const User = mongoose.model("User", UserSchema);

module.exports = User;
