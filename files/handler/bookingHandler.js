const express = require("express");
const { bookingCollection } = require("../db_collections/collection");
const { verifyJWT } = require("../utilities/authorization");
const router = express.Router();

// post booking data
router.post("/", verifyJWT, async (req, res) => {
  const bookedData = req.body;
  const productsName = bookedData.name;
  const query = { name: productsName };
  const result = await bookingCollection.insertOne(bookedData);
  res.send(result);
});

// get booking data by user email
router.get("/", async (req, res) => {
  const email = req.query.email;
  const query = { userEmail: email };
  const result = await bookingCollection.find(query).toArray();
  res.send(result.reverse());
});

// get booking data by booking id
router.get("/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;
  const query = { productId: id };
  const result = await bookingCollection.findOne(query);
  res.send(result);
});

// update booking data by id
router.put("/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;
  console.log(id, "updated Id");
  const filter = { productId: id };
  const updatedDoc = {
    $set: {
      status: true,
      paid: true,
    },
  };
  const result = await bookingCollection.updateOne(filter, updatedDoc);
  res.send(result);
});

// delete booking data by id
router.delete("/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const result = await bookingCollection.deleteOne(filter);
  res.send(result);
});

module.exports = router;
