const express = require("express");
const {
  categoryCollection,
  productsCollection,
  sellersProductsCollection,
} = require("../db_collections/collection");
const router = express.Router();

router.get("/", async (req, res) => {
  const query = {};
  const result = await categoryCollection.find(query).toArray();
  res.send(result);
});
router.get("/:category", async (req, res) => {
  const category = req.params.category;
  console.log(category);
  const query = { cat_id: category, paid: { $ne: true } };

  const globalProducts = await productsCollection.find(query).toArray();
  const sellersProduct = await sellersProductsCollection.find(query).toArray();
  const result = [...globalProducts, ...sellersProduct];
  // console.log(sellersProduct);

  res.send(result);
});

module.exports = router;
