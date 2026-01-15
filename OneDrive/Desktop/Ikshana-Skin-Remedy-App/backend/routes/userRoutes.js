const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const User = require("../models/User");

router.post("/signup", async (req, res) => {
    try {
        console.log("Incoming signup request:", req.body);

        const { username, email, password, mobile } = req.body;

        if (!username || !email || !password || !mobile) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" }); // ✅ Explicit message
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            mobile
        });

        console.log("Signup successful:", newUser);

        const token = generateToken(newUser._id);

        res.json({
            message: "User created successfully",
            token,
            userId: newUser._id
        });

    } catch (err) {
        console.error("Error in signup route:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


// ✅ LOGIN ROUTE (Handles "User not found" correctly)
router.post("/login", async (req, res) => {
    try {
        console.log("Login request received:", req.body); // Debugging log

        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: "Email and password are required." }); // No 400 status
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.json({ message: "User not found" }); // No 404 status
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect password for:", email);
            return res.json({ message: "Incorrect password" }); // No 401 status
        }

        console.log("Login successful:", user.email);
        const token = generateToken(user._id);

        res.json({
            message: "Login successful",
            token,
            userId: user._id, // ✅ Send userId
            username: user.username, // ✅ Send username
        });

    } catch (err) {
        console.error("Error in login route:", err);
        res.json({ message: "Internal server error" }); // No 500 status
    }
});

module.exports = router;
