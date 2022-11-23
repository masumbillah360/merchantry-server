const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
// port
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is runnig");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
