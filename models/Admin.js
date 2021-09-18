const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
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
    isInstitute: {
        type: Boolean,
        default: false,
    },
    instituteName: {
        type: String,
    }
},{
    timestamps: true
  });

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
