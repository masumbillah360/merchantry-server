const express = require("express");
const {
  categoryCollection,
  productsCollection,
  sellersProductsCollection,
} = require("../db_collections/collection");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = {};
    const result = await categoryCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});
router.get("/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const query = { cat_id: category, paid: { $ne: true } };
    const globalProducts = await productsCollection.find(query).toArray();
    const sellersProduct = await sellersProductsCollection
      .find(query)
      .toArray();
    const result = [...globalProducts, ...sellersProduct];
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
