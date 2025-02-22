const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Define user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // Ensuring username is required
        unique: true     // Ensuring the username is unique
    },
    email: {
        type: String,
        required: true,  // Ensuring email is required
        unique: true     // Ensuring the email is unique
    },
    password: String,
});

// Use passport-local-mongoose to add methods like `authenticate()`, `setPassword()`, etc.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
