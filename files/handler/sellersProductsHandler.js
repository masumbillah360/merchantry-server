const express = require("express");
const { sellersProductsCollection } = require("../db_collections/collection");
const { verifyJWT } = require("../utilities/authorization");
const router = express.Router();

router.post("/", verifyJWT, async (req, res) => {
  try {
    const data = req.body;
    const result = await sellersProductsCollection.insertOne(data);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});
router.get("/", verifyJWT, async (req, res) => {
  try {
    const email = req.query.email;
    const query = { userEmail: email };
    const result = await sellersProductsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const result = await sellersProductsCollection.deleteOne(filter);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

router.put("/advertised-products", verifyJWT, async (req, res) => {
  try {
    const id = req.query.id;
    const filter = { _id: ObjectId(id) };
    const doc = req.body;
    const updatedDoc = {
      $set: doc,
    };
    const result = await sellersProductsCollection.updateOne(
      filter,
      updatedDoc
    );
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});
router.get("/advertised-products", async (req, res) => {
  try {
    const query = { advertised: true, paid: { $ne: true } };
    const result = await sellersProductsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
