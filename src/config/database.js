const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://aka5h_u:Akudash17!@cluster0.3fxwnsn.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
