require("dotenv").config();
const mongoose = require("mongoose");
async function connectMongoDb() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}

module.exports = {
  connectMongoDb,
};
