const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require('express-session');
const passport = require("passport");
const localStrategy = require("passport-local");
const connectFlash = require('connect-flash'); // Import connect-flash
const ejsMate = require("ejs-mate");

const listing = require("./routes/listing.jsx");
const reviews = require("./routes/review.jsx");
const User = require("./models/user.jsx");  // Corrected to use User model
const userRouter = require("./routes/user.jsx");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// MongoDB connection
async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
main();

// Middleware and settings
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Flash messages middleware
app.use(connectFlash()); // Initialize connect-flash middleware

// Session setup
const sessionOptions = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
};

app.use(session(sessionOptions));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass the current user to all views
app.use((req, res, next) => {
    res.locals.user = req.user; // Pass the user to all views
    next();
});

// Routes
app.get("/", (req, res) => {
    res.render("home", { 
        loginSuccess: req.flash('loginSuccess'), 
        signupSuccess: req.flash('signupSuccess') 
    });
});

app.use("/listing", listing);
app.use("/listing/:id/reviews", reviews);
app.use("/", userRouter);

// 404 Error Handling Route
app.all('*', (req, res) => {
    res.status(404).render("error1", { error: "Page not found" });
});

const reviewRoutes = require('./routes/review.jsx');
app.use('/reviews', reviewRoutes); // Mount the reviews router at /reviews

// General error handling middleware (500 Error)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error", { error: err.message });  // Ensure error.ejs exists in views
});

// Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
