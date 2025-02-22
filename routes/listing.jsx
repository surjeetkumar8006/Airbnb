const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.jsx");
// Custom middleware to check authentication

// INDEX Route - Show all listings
router.get("/", async (req, res, next) => {
  try {
    const allListing = await Listing.find({}); // Fetch all listings from the database
    res.render("listing/index", { allListing }); // Render the index page with listings
  } catch (error) {
    next(error); // If any error occurs, pass it to the error handler
  }
});

// NEW Route - Show form for creating a new listing
router.get("/new",  (req, res) => {
  res.render("listing/new"); // Render the form to create a new listing
});

// SHOW Route - Show a single listing by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); // Populate reviews if available
    if (!listing) {
      return res.status(404).send("Listing not found"); // If no listing is found, show a 404 error
    }
    res.render("listing/show", { listing, reviews: listing.reviews }); // Render the show page with the listing and reviews
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
});

// CREATE Route - Handle creating a new listing (POST request)
router.post("/",  async (req, res, next) => {
  try {
    const newListing = new Listing({
      ...req.body.listing, // Spread the data from the form submission
      author: req.user.id, // Associate the listing with the current authenticated user
    });
    await newListing.save(); // Save the new listing to the database
    res.redirect("/listing"); // Redirect to the listings page after creation
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
});

// EDIT Route - Show form to edit an existing listing
router.get("/:id/edit",  async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id); // Find the listing by its ID
    
    // Check if the logged-in user is the author of the listing
    if (listing.author.toString() !== req.user.id.toString()) {
      return res.redirect("/listing"); // Redirect to listings page if the user is not the author
    }

    res.render("listing/edit", { listing }); // Render the edit page for the listing
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
});

// UPDATE Route - Handle the actual update of a listing (PUT request)
router.put("/:id",  async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id); // Find the listing by its ID
    
    // Check if the logged-in user is the author of the listing
    if (listing.author.toString() !== req.user.id.toString()) {
      return res.redirect("/listing"); // Redirect to listings page if the user is not the author
    }

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    res.redirect(`/listing/${updatedListing._id}`); // Redirect to the updated listing page
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
});

// DELETE Route - Delete a listing
router.delete("/:id",  async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id); // Find the listing by its ID
    
    // Check if the logged-in user is the author of the listing
    if (listing.author.toString() !== req.user.id.toString()) {
      return res.redirect("/listing"); // Redirect to listings page if the user is not the author
    }

    // Delete the listing from the database
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing"); // Redirect to the listings page after deletion
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
});

module.exports = router;
