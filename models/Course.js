const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: [{
        type: String,
        required: true,
    }],
    tags: [{
        type: String
    }],
    outcomes: [{
        type: String
    }],
    rating:{
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    modules: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],
    feedback: [FeedbackSchema],
},{
    timestamps: true
  });

const FeedbackSchema = new mongoose.Schema({
    respondent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true,
    }
},{
    timestamps: true
  });

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
