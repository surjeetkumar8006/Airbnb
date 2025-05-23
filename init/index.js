const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb+srv://ersurjeet:surjeetkumar@zoom.kxiqqdp.mongodb.net/wanderlust?retryWrites=true&w=majority";
const defaultAuthorId = "65a12345b6c78d90e1f23456"; // Replace with a valid User ID

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch((err) => console.error("❌ MongoDB Connection Failed!", err));

async function seedDB() {
  try {
    await Listing.deleteMany({}); // Clears previous data

    // Formatting Data and Ensuring `author` Exists
    const formattedData = initData.data.map((listing) => ({
      ...listing,
      image: listing.image?.url || listing.image,
      author: listing.author || defaultAuthorId, // Ensuring `author` exists
    }));

    await Listing.insertMany(formattedData);
    console.log("✅ Database Seeded Successfully!");
    mongoose.connection.close(); // Close connection after seeding
  } catch (error) {
    console.error("❌ Error Seeding Database!", error);
  }
}

// Run the function
seedDB();
