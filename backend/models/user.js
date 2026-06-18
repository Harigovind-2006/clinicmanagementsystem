const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String, 
        required: true, 
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true
    },
    pan: {
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true,
        trime: true
    },
    dob:{
        type: Date,
        required: true
    },
    mobile:{
        type: String,
        required: true,
        trim: true
    },
    adhaar:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role:{
        type: String,
        enum: ['manager', 'fos', 'seniordoctor', 'juniordoctor', 'nurse', 'pharmacist', 'labtechnician', 'receptionist'],
        required: true
    },
    address:{
        type: String,
        required: true,
        trim: true
    },
    gender:{
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    }

},{
    timestamps: true
});


module.exports = mongoose.model("User", userSchema);