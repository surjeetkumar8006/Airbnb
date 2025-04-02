const mongoose = require("mongoose");
const Listing = require("../models/listing.jsx");
const initData = require("./data.jsx");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
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
