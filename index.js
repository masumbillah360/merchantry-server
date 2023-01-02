const express = require("express");
const cors = require("cors");
require("dotenv").config();
const usersHandler = require("./files/handler/userHandler");
const bookingHandler = require("./files/handler/bookingHandler");
const productsHandler = require("./files/handler/productsHandler");
const categoriesHandler = require("./files/handler/categoryHandler");

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
    // users route
    app.use("/users", usersHandler);
    // products handler
    app.use("/products", productsHandler);
    // category handler
    app.use("/categories", categoriesHandler);
    // booking route
    app.use("/booking", bookingHandler);
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
