const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const User = require("../models/user");
const authRouter = require("./auth");
const { validateEditProfileData } = require("../utils/validation");
var validator = require("validator");
const bcrypt = require("bcrypt");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //console.log(req.body);
    const user = req.user;
    if (!user) {
      throw new Error("User not present");
    }
    //console.log(user);

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData) {
      throw new Error("Edit not allowed");
    }
    const loggedInUSer = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUSer[key] = req.body[key]));

    await loggedInUSer.save();
    res.json({
      message: `${loggedInUSer.firstName}, your profile has been updated successfully`,
      data: loggedInUSer,
    });
  } catch (err) {
    res.status(400).send("ERROR: ", err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const password = req.body.password;
    console.log(password);
    const isPasswordStrong = validator.isStrongPassword(password);
    console.log(isPasswordStrong);
    if (!isPasswordStrong) {
      throw new Error("Passowrd not strong enough");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser.password);
    loggedInUser.password = await bcrypt.hash(password, 10);

    await loggedInUser.save();
    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
