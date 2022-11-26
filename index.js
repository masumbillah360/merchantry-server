const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const jwt = require("jsonwebtoken");
const { query } = require("express");

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
    const sellersProductsCollection = client
      .db(process.env.DB_NAME)
      .collection("sellersProducts");
    const paymentCollection = client
      .db(process.env.DB_NAME)
      .collection("payments");
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
      const query = { cat_id: category, paid: { $ne: true } };

      const globalProducts = await productsCollection.find(query).toArray();
      const sellersProduct = await sellersProductsCollection
        .find(query)
        .toArray();
      const result = [...globalProducts, ...sellersProduct];
      console.log(sellersProduct);

      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const query = { paid: { $ne: true } };
      const results = await productsCollection.find(query).toArray();
      res.send(results);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      if (!result) {
        const sellersProduct = await sellersProductsCollection.findOne(query);
        res.send(sellersProduct);
      } else {
        res.send(result);
      }
    });

    app.post("/booking", async (req, res) => {
      const bookedData = req.body;
      const productsName = bookedData.name;
      const query = { name: productsName };
      const prevData = await bookingCollection.findOne(query);
      if (prevData) {
        res.send({ status: "Already Booked" });
        console.log("booked");
        return;
      }
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
    app.delete("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id, "whishlist");
      const filter = { _id: ObjectId(id) };
      const result = await whishlistCollection.deleteOne(filter);
      res.send(result);
    });
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await paymentCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/create-payment-intent", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const price = booking.price;
      const amount = price * 100;
      console.log(amount + "amount");
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      console.log(payment);
      const productId = payment.productId;
      console.log(productId);
      const result = await paymentCollection.insertOne(payment);
      const filter = { _id: ObjectId(productId) };
      const updatedDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      };
      const updated = await productsCollection.updateOne(filter, updatedDoc);
      if (!updated.modifiedCount) {
        const sellersProductUpdate = await sellersProductsCollection.updateOne(
          filter,
          updatedDoc
        );
      }
      res.send(result);
    });
    app.get("/payments", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });

    // seller section

    app.post("/sellers-product", async (req, res) => {
      const data = req.body;
      const result = await sellersProductsCollection.insertOne(data);
      res.send(result);
    });
    app.get("/sellers-product", async (req, res) => {
      const email = req.query.email;
      const query = {};
      const result = await sellersProductsCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/sellers-product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await sellersProductsCollection.deleteOne(filter);
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
