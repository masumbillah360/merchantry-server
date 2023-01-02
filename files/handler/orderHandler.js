app.get("/orders", verifyJWT, async (req, res) => {
  const email = req.query.email;
  console.log(email);
  const query = { userEmail: email };
  const result = await paymentCollection.find(query).toArray();
  res.send(result);
});
app.delete("/orders/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await paymentCollection.deleteOne(query);
  res.send(result);
});
