const express = require("express");
const {
  paymentCollection,
  productsCollection,
  sellersProductsCollection,
  whishlistCollection,
  bookingCollection,
} = require("../db_collections/collection");
const { verifyJWT } = require("../utilities/authorization");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

// create payment intent for payment
router.post("/payment-intent", verifyJWT, async (req, res) => {
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

// insert payment information and update paid product
router.post("/", async (req, res) => {
  const payment = req.body;
  const id = payment?.productId;
  const paymentResult = await paymentCollection.insertOne(payment);
  const query = { _id: ObjectId(id) };
  const result = await productsCollection.findOne(query);
  const updatedDoc = {
    $set: {
      paid: true,
      transactionId: payment.transactionId,
    },
  };
  if (result) {
    await productsCollection.updateOne(query, updatedDoc);
  }
  const sellersProduct = await sellersProductsCollection.findOne(query);
  if (sellersProduct) {
    await sellersProductsCollection.updateOne(query, updatedDoc);
  }
  const filter = { productId: id };
  const wishlistProducts = await whishlistCollection.findOne(filter);
  if (wishlistProducts) {
    await whishlistCollection.updateOne(filter, updatedDoc);
  }
  const bookedData = await bookingCollection.findOne(filter);
  if (bookedData) {
    await bookingCollection.updateOne(filter, updatedDoc);
  }

  res.send(paymentResult);
});

// get payment information
router.get("/", verifyJWT, async (req, res) => {
  const email = req.query.email;
  console.log(email);
  const query = { userEmail: email };
  const result = await paymentCollection.find(query).toArray();
  res.send(result);
});

// delete payment paid product
router.delete("/:transactionId", verifyJWT, async (req, res) => {
  const transactionId = req.params.transactionId;
  const query = { transactionId: transactionId };
  const result = await paymentCollection.deleteOne(query);
  res.send(result);
  console.log(result);
});

module.exports = router;
