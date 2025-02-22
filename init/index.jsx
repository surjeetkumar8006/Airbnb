const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const initData = require("./data.jsx");
const Listing = require("../models/listing.jsx");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });

async function main() {
  await mongoose.connect(MONGO_URL);

  const formattedData = initData.data.map(listing => ({
    ...listing,
    image: listing.image.url  // Only keeping the URL string
  }));

  await Listing.insertMany(formattedData);
}
