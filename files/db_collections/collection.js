const { MongoClient } = require("mongodb");

// mongodb url
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.pwgovse.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// scaffolding
const collection = {};

collection.userCollection = client.db(process.env.DB_NAME).collection("users");
collection.sellersProductsCollection = client
  .db(process.env.DB_NAME)
  .collection("sellersProducts");
collection.paymentCollection = client
  .db(process.env.DB_NAME)
  .collection("payments");
collection.whishlistCollection = client
  .db(process.env.DB_NAME)
  .collection("wishlist");
collection.bookingCollection = client
  .db(process.env.DB_NAME)
  .collection("booking");
collection.productsCollection = client
  .db(process.env.DB_NAME)
  .collection("products");
collection.categoryCollection = client
  .db(process.env.DB_NAME)
  .collection("categories");

module.exports = collection;
