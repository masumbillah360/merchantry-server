app.post("/sellers-product", verifyJWT, async (req, res) => {
  const data = req.body;
  const result = await sellersProductsCollection.insertOne(data);
  res.send(result);
});
app.get("/sellers-product", verifyJWT, async (req, res) => {
  const email = req.query.email;
  const query = { userEmail: email };
  const result = await sellersProductsCollection.find(query).toArray();
  res.send(result);
});
app.delete("/sellers-product/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const result = await sellersProductsCollection.deleteOne(filter);
  res.send(result);
});

app.put("/advertised-products", verifyJWT, async (req, res) => {
  const id = req.query.id;
  const filter = { _id: ObjectId(id) };
  const doc = req.body;
  console.log(doc);
  const updatedDoc = {
    $set: doc,
  };
  const result = await sellersProductsCollection.updateOne(filter, updatedDoc);
});
app.get("/advertised-products", async (req, res) => {
  const query = { advertised: true, paid: { $ne: true } };
  const result = await sellersProductsCollection.find(query).toArray();
  res.send(result);
});
