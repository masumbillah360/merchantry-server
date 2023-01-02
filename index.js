const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
// configure file
const config_file = {
  port: process.env.port || 8000,
};

// middleware
app.use(cors());
app.use(express.json());

const apiRunner = async () => {
  try {
    app.use("/users", usersHandler);
  } catch (error) {}
};

// default route
app.get("/", (req, res) => {
  res.send("server is runnig");
});

apiRunner().catch((err) => console.log(err));
app.listen(config_file.port, () => {
  console.log(`server is running on port ${port}`);
});
