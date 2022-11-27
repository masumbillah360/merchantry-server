const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
// port
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const jwt = require("jsonwebtoken");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.pwgovse.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const verifyJWT = async (req, res, next) => {
  console.log("coll jwt");
  const token = req.header("authorisation");
  if (!token) {
    res.status(401).send({ message: "Unauthorised access" });
  }
  try {
    const selectedToken = token.split(" ")[1];
    const user = jwt.verify(
      selectedToken,
      process.env.SECRET_KEY_TOKEN,
      (err, decoded) => {
        if (err) {
          res.status(403).send({ message: "Invalid access" });
        }
        req.decoded = decoded;
        next();
      }
    );
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
};
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
    app.post("/jwt", (req, res) => {
      const email = req.body;
      console.log(req.body);
      console.log(email, "jwt email");
      const token = jwt.sign(email, process.env.SECRET_KEY_TOKEN);
      res.send({ token });
    });
    app.post("/users", verifyJWT, async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log("post user");
    });

    app.get("/users", verifyJWT, async (req, res) => {
      const userCategory = req.query.userStatus;
      console.log(userCategory);
      const query = { status: userCategory };
      const result = await userCollection.find(query).toArray();
      res.send(result);
      console.log("users");
    });
    app.get("/users/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    app.put("/users/", verifyJWT, async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const doc = req.body;
      console.log(doc);
      console.log(email, "verify");
      const filter = { email: email };
      const updatedDoc = {
        $set: doc,
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
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
      // console.log(sellersProduct);

      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const query = { paid: { $ne: true } };
      const sellersProductQuery = {
        paid: { $ne: true },
        advertised: { $ne: true },
      };
      const homeProdcuts = await productsCollection.find(query).toArray();
      const sellersProduct = await sellersProductsCollection
        .find(sellersProductQuery)
        .toArray();
      const results = [...homeProdcuts, ...sellersProduct];
      // console.log(sellersProduct);
      res.send(results);
    });
    app.get("/buy-product/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { paid: { $ne: true } };
      const homeProdcuts = await productsCollection.find(query).toArray();
      const sellersProduct = await sellersProductsCollection
        .find(query)
        .toArray();
      const results = [...homeProdcuts, ...sellersProduct];
      const product = results.find((product) => product._id == id);
      console.log(product);
      res.send(product);
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

    app.post("/booking", verifyJWT, async (req, res) => {
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
    app.get("/booking", verifyJWT, async (req, res) => {
      const query = {};
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/booking/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.findOne(query);
      res.send(result);
    });
    app.put("/booking/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      console.log(id, "updated Id");
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: true,
        },
      };
      const result = await bookingCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.delete("/booking/:id", verifyJWT, async (req, res) => {
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

    app.get("/wishlist", verifyJWT, async (req, res) => {
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
    app.get("/orders", verifyJWT, async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/orders/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await paymentCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/create-payment-intent", verifyJWT, async (req, res) => {
      const bookingData = req?.body;
      console.log(bookingData);
      const price = bookingData.presentPrice;
      const amount = price * 100;
      console.log(amount + "amount");
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          currency: "usd",
          amount: amount,
          payment_method_types: ["card"],
        });
        console.log(paymentIntent.client_secret);
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        res.send({ status: "Something went wrong" });
      }
    });
    app.post("/payments", verifyJWT, async (req, res) => {
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
        const sellersUpdate = {
          $set: {
            paid: true,
            status: true,
            transactionId: payment.transactionId,
          },
        };
        const sellersProductUpdate = await sellersProductsCollection.updateOne(
          filter,
          sellersUpdate
        );
      }
      res.send(result);
    });
    app.get("/payments", verifyJWT, async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { userEmail: email };
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/payments/:transactionId", verifyJWT, async (req, res) => {
      const transactionId = req.params.transactionId;
      const query = { transactionId: transactionId };
      const result = await paymentCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    // seller section

    app.post("/sellers-product", verifyJWT, async (req, res) => {
      const data = req.body;
      const result = await sellersProductsCollection.insertOne(data);
      res.send(result);
    });
    app.get("/sellers-product", verifyJWT, async (req, res) => {
      const email = req.query.email;
      const query = {};
      const result = await sellersProductsCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/sellers-product/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await sellersProductsCollection.deleteOne(filter);
      res.send(result);
    });

    app.put("/advertised-products", verifyJWT, async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const doc = req.body;
      console.log(doc);
      const updatedDoc = {
        $set: doc,
      };
      const result = await sellersProductsCollection.updateOne(
        filter,
        updatedDoc
      );
    });
    app.get("/advertised-products", async (req, res) => {
      const query = { advertised: true, paid: { $ne: true } };
      const result = await sellersProductsCollection.find(query).toArray();
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
