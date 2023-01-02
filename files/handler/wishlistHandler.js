const express = require("express");
const { verifyJWT } = require("../utilities/authorization");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const result = await whishlistCollection.insertOne(data);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

router.get("/", verifyJWT, async (req, res) => {
  try {
    const email = req.query.email;
    const query = { userEmail: email };
    const result = await whishlistCollection.find(query).toArray();
    res.send(result.reverse());
  } catch (error) {
    res.send({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const result = await whishlistCollection.deleteOne(filter);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
