const express = require("express");
const { paymentCollection } = require("../db_collections/collection");
const router = express.Router();

router.get("/", verifyJWT, async (req, res) => {
  const email = req.query.email;
  console.log(email);
  const query = { userEmail: email };
  const result = await paymentCollection.find(query).toArray();
  res.send(result);
});
router.delete("/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await paymentCollection.deleteOne(query);
  res.send(result);
});

module.exports = router;
