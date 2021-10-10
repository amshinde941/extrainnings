
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const completedCoursesSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  completionDate: {
    type: Date,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  certificate: {
    type: String,
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Enter valid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Enter a strong password");
      }
    },
  },
  isInstitute: {
    type: Boolean,
    default: false,
  },
  instituteName: {
    type: String,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  completedCourses: [completedCoursesSchema],
  tokens: [
    {
      token: {
        required: true,
        type: String,
      },
    },
  ],
}, {
  timestamps: true
});

UserSchema.statics.findUsingCredentials = async (email, password) => {
  const lowercaseEmail = email.toLowerCase();
  const user = await User.findOne({ email: lowercaseEmail });
  console.log("findusing :"+user);
  if (!user) {
    throw new Error("User not found");
  }

  const isFound = await bcrypt.compare(password, user.password);
 console.log("isfound: "+isFound);
  if (!isFound) {
    throw new Error("You have entered wrong password");
  }

  return user;
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this; //user being generate
  const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//mongoose middleware to hash user passwords
UserSchema.pre("save", async function (next) {
  const user = this; //user which is being saved

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

export const User = mongoose.model("User", UserSchema);

