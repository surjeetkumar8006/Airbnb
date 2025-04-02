const mongoose = require("mongoose");
const User = require("../models/user.jsx");   
const Listing = require("../models/listing.jsx");   
const Review = require("../models/review.jsx");   

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// ✅ MongoDB से Connect करो
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

// ✅ Dummy Data Add करने का Function
const seedDB = async () => {
  await User.deleteMany({});
  await Listing.deleteMany({});
  await Review.deleteMany({});

  // 👉 Dummy User बनाओ
  const newUser = new User({ username: "testuser", email: "test@example.com" });
  const registeredUser = await User.register(newUser, "password123");
  console.log("✅ User Created:", registeredUser);

  const newListing = new Listing({
    title: "Test Listing",
    description: "This is a test listing.",
    price: 100,
    owner: registeredUser._id
  });
  await newListing.save();
  console.log("✅ Listing Created:", newListing);

  const newReview = new Review({
    text: "This is a test review!",
    rating: 5,
    author: registeredUser._id,
    listing: newListing._id
  });
  await newReview.save();

  newListing.reviews.push(newReview._id);
  await newListing.save();

  console.log("✅ Review Created:", newReview);
};


seedDB().then(() => {
  mongoose.connection.close();
});
