const express = require("express");
const { paymentCollection } = require("../db_collections/collection");
const { verifyJWT } = require("../utilities/authorization");
const router = express.Router();

router.get("/", verifyJWT, async (req, res) => {
  try {
    const email = req.query.email;
    const query = { userEmail: email };
    const result = await paymentCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await paymentCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
