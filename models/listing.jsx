const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true, // Ensures title is required
  },
  description: {
    type: String,
    required: true, // Ensures description is required
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60", // Default image URL
  },
  price: {
    type: Number,
    required: false, // You can set it as required if needed
    validate: {
      validator: function(value) {
        return value > 0; // Ensure price is a positive number
      },
      message: "Price should be a positive number",
    },
  },
  location: String,
  country: String,
  author: {
    type: Schema.Types.ObjectId, // Reference to the User model
    ref: "User", // Assuming you have a User model that stores user data
    required: true, // Ensures every listing has an author
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // Assuming you have a Review model
    },
  ],
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Create the Listing model based on the schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
