const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ✅ Prevent OverwriteModelError
const ListingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: "default_image_url_here" },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
}, { timestamps: true });

module.exports = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);
