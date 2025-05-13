const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
var validator = require("validator");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //validate data
    validateSignUpData(req);
    //encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
  // console.log(req.body);
});

authRouter.post("/login", async (req, res) => {
  try {
    const { _id, emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Not a valid Email ID");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    //const hash =
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      var token = await user.getJWT();
      console.log(token);
      res.cookie("token", token);
      res.send("Logged In Successfully");
    } else {
      throw new Error("Password not correct");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful");
});

module.exports = authRouter;
