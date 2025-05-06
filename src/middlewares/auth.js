var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).send("Please Login!");
    }
    const decodedMessage = await jwt.verify(token, "Ak@devtinder006");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
};

module.exports = {
  userAuth,
};
