const express = require("express");
const { userCollection } = require("../db_collections/collection");
const { verifyJWT } = require("../utilities/authorization");
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const result = await userCollection.insertOne(user);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

router.get("/", verifyJWT, async (req, res) => {
  try {
    const userCategory = req.query.userStatus;
    console.log(userCategory);
    const query = { status: userCategory };
    const result = await userCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const email = req.params.id;
    console.log(email, "email");
    const query = { email: email };
    const result = await userCollection.findOne(query);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});
router.put("/", verifyJWT, async (req, res) => {
  try {
    const email = req.query.email;
    const doc = req.body;
    const filter = { email: email };
    const updatedDoc = {
      $set: doc,
    };
    const result = await userCollection.updateOne(filter, updatedDoc);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const result = await userCollection.deleteOne(filter);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
