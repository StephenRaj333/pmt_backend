const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
        minlength: [4, "Name must be at least 4 characters long"],
        maxlength: [30, "Name must be at most 30 characters long"],
        match: [/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
    }
});


module.exports = mongoose.model("users",userSchema); 
