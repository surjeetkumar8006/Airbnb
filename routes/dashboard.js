const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

// ✅ Middleware to Check Authentication
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You need to login first!");
    return res.redirect("/login");
  }
  next();
};

// ✅ Dashboard Route (Protected)
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Fetch user details
    res.render("users/dashboard", { user });
  } catch (err) {
    console.error("Dashboard Error:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/");
  }
});

module.exports = router;
