const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
// port
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.pwgovse.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const dbRunner = async () => {
  try {
    const userCollection = client.db(process.env.DB_NAME).collection("users");
    const whishlistCollection = client
      .db(process.env.DB_NAME)
      .collection("wishlist");
    const bookingCollection = client
      .db(process.env.DB_NAME)
      .collection("booking");
    const productsCollection = client
      .db(process.env.DB_NAME)
      .collection("products");
    const categoryCollection = client
      .db(process.env.DB_NAME)
      .collection("categories");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log("post user");
    });

    app.get("/users", async (req, res) => {
      const userCategory = req.query.userStatus;
      if (userCategory) {
        console.log(userCategory);
        const query = { status: userCategory };
        const result = await userCollection.find(query).toArray();
        res.send(result);
      } else {
        const query = {};
        const result = await userCollection.find(query).toArray();
        res.send(result);
      }
      console.log("users");
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/categories/:category", async (req, res) => {
      const category = req.params.category;
      console.log(category);
      const query = { cat_id: category };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.post("/booking", async (req, res) => {
      const bookedData = req.body;
      const result = await bookingCollection.insertOne(bookedData);
      res.send(result);
    });
    app.get("/booking", async (req, res) => {
      const query = {};
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.findOne(query);
      res.send(result);
    });
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(filter);
      res.send(result);
    });
    app.post("/wishlist", async (req, res) => {
      const data = req.body;
      const result = await whishlistCollection.insertOne(data);
      res.send(result);
    });
    app.get("/wishlist", async (req, res) => {
      const query = {};
      const result = await whishlistCollection.find(query).toArray();
      res.send(result);
    });
    console.log("connection is runnig");
  } catch (error) {}
};

app.get("/", (req, res) => {
  res.send("server is runnig");
});

dbRunner().catch((err) => console.log(err));
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
