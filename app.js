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

// ✅ Models & Routes
const User = require("./models/user.js");
const listingRoutes = require("./routes/listing.js");
const userRoutes = require("./routes/user.js");
const dashboardRoutes = require("./routes/dashboard.js");
const reviewRoutes = require("./routes/review.js");

// ✅ MongoDB Atlas Connection
const MONGO_URL =
  "mongodb+srv://ersurjeet:surjeetkumar@zoom.kxiqqdp.mongodb.net/wanderlust?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ View Engine
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

// ✅ Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// ✅ Passport Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Flash & User Info Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ✅ Routes
app.get("/", (req, res) => {
  res.render("home"); // Ensure views/home.ejs exists
});

app.use("/", userRoutes);
app.use("/listing", listingRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/listing/:id/reviews", reviewRoutes);

// ✅ 404 Error Page
app.all("*", (req, res) => {
  res.status(404).render("error", { error: "Page not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
