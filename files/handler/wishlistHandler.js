const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;
  const result = await whishlistCollection.insertOne(data);
  res.send(result);
});

router.get("/", verifyJWT, async (req, res) => {
  const email = req.query.email;
  const query = { userEmail: email };
  const result = await whishlistCollection.find(query).toArray();
  res.send(result.reverse());
});
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id, "whishlist");
  const filter = { _id: ObjectId(id) };
  const result = await whishlistCollection.deleteOne(filter);
  res.send(result);
});

module.exports = router;
