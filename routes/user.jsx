const express = require("express");  // Import express
const router = express.Router();     // Initialize the router
const passport = require("passport"); // Passport for authentication
const User = require("../models/user.jsx"); // Your User model

// Signup Route (GET)
router.get("/signup", (req, res) => {
    res.render("users/signup", {
        signupError: req.flash('signupError'),
        signupSuccess: req.flash('signupSuccess')
    });
});

// Signup Route (POST)
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the username or email already exists (basic validation)
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            req.flash('signupError', 'Username or email already taken.');
            return res.redirect("/signup"); // Redirect back to signup if user exists
        }

        // Create new user and register with passport-local
        const newUser = new User({ username, email });
        await User.register(newUser, password);

        // Redirect to login page after successful sign-up
        req.flash('signupSuccess', 'Sign-Up successful! You can now log in.');
        res.redirect("/login"); // Redirect to login page after successful signup

    } catch (err) {
        console.log(err);
        req.flash('signupError', 'Signup failed. Please try again.');
        res.redirect("/signup"); // Redirect back to signup if error occurs
    }
});

// Login Route (GET)
router.get("/login", (req, res) => {
    res.render("users/login", {
        loginError: req.flash('loginError'),
        loginSuccess: req.flash('loginSuccess') // Pass loginSuccess message
    });
});

// Login Route (POST)
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password."
}), (req, res) => {
    req.flash('loginSuccess', 'Login successful! Welcome back!');
    res.redirect("/listing"); // Redirect to the listing page after successful login
});

// Logout Route (GET)
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // If there's an error during logout, call next to handle it
        }
        req.flash('loginSuccess', 'You have successfully logged out.');
        res.redirect("/login"); // Redirect to login page after logout
    });
});

module.exports = router; // Export router
