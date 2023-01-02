const express = require("express");
const {
  productsCollection,
  sellersProductsCollection,
} = require("../db_collections/collection");
const router = express.Router();

router.get("/", async (req, res) => {
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
router.get("/buyed/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = { _id: ObjectId(id), paid: { $ne: true } };
  const homeProdcuts = await productsCollection.findOne(query);
  if (homeProdcuts) {
    res.send(homeProdcuts);
  } else {
    const sellersProduct = await sellersProductsCollection.findOne(query);
    res.send(sellersProduct);
  }
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await productsCollection.findOne(query);
  if (result) {
    res.send(result);
  } else {
    const sellersProduct = await sellersProductsCollection.findOne(query);
    res.send(sellersProduct);
  }
});

module.exports = router;
