const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    pan: {type: String, required: true, unique: true, uppercase: true},

},{
    timestamps: true
});