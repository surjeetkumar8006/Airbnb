const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  text: {
    type: String,
    required: [true, "Review text is required!"], // Make sure there's a text
  },
  rating: {
    type: Number,
    required: [true, "Rating is required!"], // Ensure there's a rating
    min: [1, "Rating cannot be less than 1"], // Ensure rating is within range
    max: [5, "Rating cannot be greater than 5"], // Ensure rating is within range
  },
  author: {
    type: Schema.Types.ObjectId, // Reference to the User model
    ref: 'User', // Make sure it's referencing the correct User model
    required: [true, "Author is required!"], // Ensure each review has an author
  },
  listing: {
    type: Schema.Types.ObjectId, // Reference to the Listing model
    ref: 'Listing', // Ensure it's referencing the correct Listing model
    required: [true, "Listing reference is required!"], // Ensure review is associated with a listing
  },
}, { timestamps: true }); // Automatically create createdAt and updatedAt fields

// Create and export the Review model
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
