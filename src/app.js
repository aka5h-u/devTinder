const express = require("express");
const { connectDB } = require("./config/database");
require("./config/database");

var validator = require("validator");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database cant be connected");
  });
