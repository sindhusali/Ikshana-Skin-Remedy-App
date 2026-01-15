const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    mobile: {
        type: String,
        required: [true, "Mobile number is required"]
    }
});

module.exports = mongoose.model("User", userSchema);
