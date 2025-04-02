const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// ✅ Import Models & Routes
const User = require("./models/user.jsx");
const listingRoutes = require("./routes/listing.jsx");
const userRoutes = require("./routes/user.jsx");
const dashboardRoutes = require("./routes/dashboard.js"); // ✅ New Dashboard Route

// ✅ MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
mongoose.set("strictQuery", true);
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());

// ✅ Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

// ✅ Flash Messages Middleware
app.use(flash());

// ✅ Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Middleware to Pass Flash Messages & User to Views
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ✅ Home Route
app.get("/", (req, res) => {
  res.render("home");
});

// ✅ Use Routes
app.use("/", userRoutes);
app.use("/listing", listingRoutes);
app.use("/dashboard", dashboardRoutes); // ✅ New Dashboard Route

// ✅ 404 Error Handler
app.all("*", (req, res) => {
  res.status(404).render("error", { error: "Page not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
