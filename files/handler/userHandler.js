const express = require("express");
const { userCollection } = require("../db_collections/collection");
const { verifyJWT } = require("../utilities/authorization");
const router = express.Router();
router.post("/", async (req, res) => {
  const user = req.body;
  const result = await userCollection.insertOne(user);
  res.send(result);
  console.log("post user");
});

router.get("/", verifyJWT, async (req, res) => {
  const userCategory = req.query.userStatus;
  console.log(userCategory);
  const query = { status: userCategory };
  const result = await userCollection.find(query).toArray();
  res.send(result);
  console.log("users");
});
router.get("/:id", async (req, res) => {
  const email = req.params.id;
  console.log(email, "email");
  const query = { email: email };
  const result = await userCollection.findOne(query);
  res.send(result);
  console.log(result);
});
router.put("/", verifyJWT, async (req, res) => {
  const email = req.query.email;
  console.log(email);
  const doc = req.body;
  console.log(doc);
  console.log(email, "verify");
  const filter = { email: email };
  const updatedDoc = {
    $set: doc,
  };
  const result = await userCollection.updateOne(filter, updatedDoc);
  res.send(result);
});
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const result = await userCollection.deleteOne(filter);
  res.send(result);
});

module.exports = router;
