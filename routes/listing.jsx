const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.jsx");

// ✅ INDEX Route - Show all listings
router.get("/", async (req, res, next) => {
  try {
    const allListing = await Listing.find({});
    res.render("listing/index", { allListing });
  } catch (error) {
    next(error);
  }
});

// ✅ NEW Route - Show form for creating a new listing
router.get("/new", (req, res) => {
  res.render("listing/new");
});

// ✅ SHOW Route - Show a single listing by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.render("listing/show", { listing, reviews: listing.reviews });
  } catch (error) {
    next(error);
  }
});

// ✅ CREATE Route - Handle creating a new listing (Fixed)
router.post("/", async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);

    // 🔥 Ensure an author field exists
    newListing.author = req.user ? req.user._id : "660e1a2b3c4d5e6f7a8b9c0d"; // Hardcoded user ID for now

    await newListing.save();
    res.redirect("/listing");
  } catch (error) {
    next(error);
  }
});

// ✅ EDIT Route - Show form to edit an existing listing
router.get("/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.render("listing/edit", { listing });
  } catch (error) {
    next(error);
  }
});

// ✅ UPDATE Route - Update a listing
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    res.redirect(`/listing/${updatedListing._id}`);
  } catch (error) {
    next(error);
  }
});

// ✅ DELETE Route - Delete a listing
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
