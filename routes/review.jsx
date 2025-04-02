const express = require("express");
const router = express.Router({ mergeParams: true }); // ✅ Merge Params for Listing ID
const Review = require("../models/review.jsx");
const Listing = require("../models/listing.jsx");

// ✅ Middleware to Check if User is Logged In
const ensureAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to leave a review!");
    return res.redirect("/login");
  }
  next();
};

// ✅ Submit Review (POST)
router.post("/", ensureAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params; // ✅ Get Listing ID
    const { text, rating } = req.body.review;

    // ✅ Validate Input
    if (!text || text.trim() === "" || rating < 1 || rating > 5) {
      req.flash("error", "Invalid Review! Text is required & Rating must be between 1-5.");
      return res.redirect(`/listing/${id}`);
    }

    // ✅ Find Listing
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Not Found!");
      return res.redirect("/listing");
    }

    // ✅ Create New Review (Include Author)
    const newReview = new Review({
      text,
      rating,
      author: req.user._id, // 🔥 Ensure `author` is set correctly
      listing: id,
    });

    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();

    req.flash("success", "Review Submitted Successfully!");
    res.redirect(`/listing/${id}`);
  } catch (error) {
    next(error);
  }
});

// ✅ Update Review (PUT)
router.put("/:reviewId", ensureAuthenticated, async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const { text, rating } = req.body.review;

    if (!text || text.trim() === "" || rating < 1 || rating > 5) {
      req.flash("error", "Invalid Review! Text is required & Rating must be between 1-5.");
      return res.redirect(`/listing/${id}`);
    }

    // ✅ Find Review and Check if User is Owner
    const review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "Review Not Found!");
      return res.redirect(`/listing/${id}`);
    }
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "You don't have permission to edit this review!");
      return res.redirect(`/listing/${id}`);
    }

    // ✅ Update Review in DB
    review.text = text;
    review.rating = rating;
    await review.save();

    req.flash("success", "Review Updated Successfully!");
    res.redirect(`/listing/${id}`);
  } catch (error) {
    next(error);
  }
});

// ✅ Delete Review (DELETE)
router.delete("/:reviewId", ensureAuthenticated, async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    // ✅ Find Review and Check if User is Owner
    const review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "Review Not Found!");
      return res.redirect(`/listing/${id}`);
    }
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "You don't have permission to delete this review!");
      return res.redirect(`/listing/${id}`);
    }

    // ✅ Delete Review from DB
    await review.deleteOne();
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listing/${id}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
  