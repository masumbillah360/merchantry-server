app.post("/booking", verifyJWT, async (req, res) => {
  const bookedData = req.body;
  const productsName = bookedData.name;
  const query = { name: productsName };
  const result = await bookingCollection.insertOne(bookedData);
  res.send(result);
});
app.get("/booking", async (req, res) => {
  const email = req.query.email;
  const query = { userEmail: email };
  const result = await bookingCollection.find(query).toArray();
  res.send(result.reverse());
});
app.get("/booking/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;
  const query = { productId: id };
  const result = await bookingCollection.findOne(query);
  res.send(result);
});
app.put("/booking/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;
  console.log(id, "updated Id");
  const filter = { productId: id };
  const updatedDoc = {
    $set: {
      status: true,
      paid: true,
    },
  };
  const result = await bookingCollection.updateOne(filter, updatedDoc);
  res.send(result);
});
app.delete("/booking/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const result = await bookingCollection.deleteOne(filter);
  res.send(result);
});
