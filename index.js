require("dotenv").config();
const express = require("express");
const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`🚀 Server running on port ${PORT}`);
});
app.get("/test", (req, res) => {
  res.send(`testing the server`);
});

app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
