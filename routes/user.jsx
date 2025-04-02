const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.jsx");
const flash = require("connect-flash");
const { isLoggedIn } = require("../views/middleware.js"); // ✅ Middleware for authentication

// ✅ SIGNUP - Show Signup Form
router.get("/signup", (req, res) => {
    res.render("users/signup", {
        signupError: req.flash("signupError"),
        signupSuccess: req.flash("signupSuccess")
    });
});

// ✅ SIGNUP - Handle Signup Logic
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            req.flash("signupError", "Username or email already taken.");
            return res.redirect("/signup");
        }

        const newUser = new User({ username, email });
        await User.register(newUser, password);

        req.flash("signupSuccess", "Sign-Up successful! You can now log in.");
        res.redirect("/login");

    } catch (err) {
        console.error("Signup Error:", err);
        req.flash("signupError", "Signup failed. Please try again.");
        res.redirect("/signup");
    }
});

// ✅ LOGIN - Show Login Form
router.get("/login", (req, res) => {
    res.render("users/login", {
        loginError: req.flash("loginError"),
        loginSuccess: req.flash("loginSuccess")
    });
});

// ✅ LOGIN - Handle Login Logic
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash("loginError", "Invalid username or password.");
            return res.redirect("/login");
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            req.flash("loginSuccess", "Login successful! Welcome back!");
            
            // Redirect user to dashboard
            res.redirect("/dashboard");
        });
    })(req, res, next);
});

// ✅ DASHBOARD - Show User Dashboard
router.get("/dashboard", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render("users/dashboard", { user });
    } catch (err) {
        console.error("Dashboard Error:", err);
        req.flash("error", "Something went wrong. Try again later.");
        res.redirect("/");
    }
});

// ✅ PROFILE EDIT - Show Edit Form
router.get("/profile/edit", isLoggedIn, (req, res) => {
    res.render("users/edit", { user: req.user });
});

// ✅ PROFILE EDIT - Handle Profile Update
router.post("/profile/edit", isLoggedIn, async (req, res) => {
    try {
        const { username, email } = req.body;
        await User.findByIdAndUpdate(req.user._id, { username, email }, { new: true });

        req.flash("success", "Profile updated successfully!");
        res.redirect("/dashboard");
    } catch (err) {
        console.error("Profile Update Error:", err);
        req.flash("error", "Error updating profile. Try again!");
        res.redirect("/profile/edit");
    }
});

// ✅ LOGOUT - Handle Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("loginSuccess", "You have successfully logged out.");
        res.redirect("/login");
    });
});

module.exports = router;
