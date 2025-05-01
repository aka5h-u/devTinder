const express = require("express");
const { connectDB } = require("./config/database");
require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
  // console.log(req.body);
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });

    res.send("User deleted");
  } catch (error) {
    res.status(400).send("User not found");
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender"];

    const isUpdateAllowed = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Updates not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Cannot add more skills");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, req.body, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Update failed " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

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
