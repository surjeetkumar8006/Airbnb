const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    text: { 
      type: String, 
      required: [true, "Review text is required!"], 
      trim: true 
    },
    rating: { 
      type: Number, 
      required: [true, "Rating is required!"], 
      min: [1, "Rating must be at least 1"], 
      max: [5, "Rating cannot exceed 5"] 
    },
    author: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "Author is required!"] 
    },
    listing: { 
      type: Schema.Types.ObjectId, 
      ref: "Listing", 
      required: [true, "Listing reference is required!"] 
    }
  },
  { timestamps: true }
);

// ✅ Check if model already exists before defining
module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);
