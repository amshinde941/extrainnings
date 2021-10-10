import mongoose from 'mongoose';
const quizSchema = new mongoose.Schema({
    question: {
        type: String,
    },
    options: [{
        type: String,
    }],
    answer: {
        type: String,
    }
});
const ModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    isLecture: {
        type: Boolean,
        default: true,
    },
    videos: [{
        type: String,
    }],
    description: [{
        type: String,
    }],
    resourses: [{
        type: String,
    }],
    quiz: [quizSchema],
},{
    timestamps: true
});

export const Module = mongoose.model("Module", ModuleSchema);

