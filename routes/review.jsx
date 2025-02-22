const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.jsx"); // Make sure the model file has .js extension, not .jsx
const Review = require("../models/review.jsx"); // Same here, check file extension

// Protected route to create a review for a listing
router.post("/:listingId/review", async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { text, rating } = req.body.review; // Extract text and rating from the request body

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    // Ensure that text is provided
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Review text cannot be empty." });
    }

    // Find the listing by ID
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    // Create a new review
    const newReview = new Review({
      text, // Use text for review content
      rating, // Use rating
      author: req.user.id, // Associate the review with the logged-in user
      listing: listingId, // Associate the review with the listing
    });

    // Save the review to the database
    await newReview.save();

    // Add the review to the listing's reviews array
    listing.reviews.push(newReview._id);
    await listing.save();

    // Return success response (instead of redirecting)
    res.status(201).json({
      message: "Review submitted successfully.",
      review: newReview, // Optional: Return the review object if needed
    });

  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

module.exports = router;
