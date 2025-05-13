const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const User = require("../models/user");
const authRouter = require("./auth");
const { validateEditProfileData } = require("../utils/validation");
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

module.exports = profileRouter;
