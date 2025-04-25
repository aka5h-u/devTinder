const express = require("express");
const app = express();
app.use("/test", (req, res) => {
  res.send("Do not come here, TEST page");
});

app.use("/hello", (req, res) => {
  res.send("HEllo hello hello");
});
app.use("/", (req, res) => {
  res.send("Hello from the server");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
